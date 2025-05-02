import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { CvsService } from './cvs.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillsService } from 'src/skills/skills.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Role, User } from '@prisma/client';
import { ImageValidationPipe } from 'src/file-upload/pipes/image_validation.pipe';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { CvModifiedPayload } from './dto/cv-modified-payload.dto';


@Resolver(() => Cv)
export class CvsResolver {
  private readonly pubSub: RedisPubSub;

  constructor(
    private readonly cvsService: CvsService,
    private readonly skillsService: SkillsService,
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService
  ) {
    const redisHost = configService.get<string>('REDIS_HOST');
    const redisPort = configService.get<number>('REDIS_PORT');

    this.pubSub = new RedisPubSub({
      publisher: new Redis({ host: redisHost, port: redisPort }),
      subscriber: new Redis({ host: redisHost, port: redisPort }),
    });
  }

  @Mutation(() => Cv)
  async createCv(
    @GetUser() user: User,
    @Args('createCvInput') createCvInput: CreateCvInput,
    @Args(
      { name: 'file', type: () => GraphQLUpload },
      new ImageValidationPipe(),
    )
    file: FileUpload,
  ) {
    const path = await this.fileUploadService.saveImage(file);
    
    const newCv = await this.cvsService.create({
      userId: user.id,
      ...createCvInput,
      path,
    });
    await this.pubSub.publish(
      'cvModified', 
      { cvModified: { type: 'CREATED', cv: newCv } }
    );
    return newCv;

  }

  @Query(() => [Cv], { name: 'cvs' })
  findAll(@GetUser() user: User) {
    if (user.role === Role.USER) {
      return this.cvsService.getCvsByUserId(user.id);
    }
    return this.cvsService.findAll();
  }

  @Query(() => Cv, { name: 'cv' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.cvsService.findOne(id);
  }

  @ResolveField('skills', () => [Skill])
  skills(@Parent() cv: Cv) {
    return this.skillsService.getSkillsByCvId(cv.id);
  }

  @Mutation(() => Cv)
  async updateCv(
    @Args('updateCvInput') updateCvInput: UpdateCvInput,
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User,
  ) {
    const updated_cv = await this.cvsService.update(
      id, 
      { ...updateCvInput, userId: user.id }
    );
    this.pubSub.publish(
      'cvModified', 
      { cvModified: { type: 'UPDATED', cv: updated_cv } }
    );
    return updated_cv;
  }

  @Mutation(() => Cv)
  async removeCv(@Args('id', { type: () => ID }) id: string, @GetUser() user: User) {
    const deletedCv = await this.cvsService.deleteCv(id, user.id);
    this.pubSub.publish(
      'cvModified', 
      { cvModified: { type: 'DELETED', cv: deletedCv } }
    );
    return deletedCv;
  }

  @Subscription(() => CvModifiedPayload, {
    resolve: (payload) => payload.cvModified,
  })
  cvModified() {
    return this.pubSub.asyncIterator('cvModified');
  }

  
}
