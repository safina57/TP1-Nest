import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
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

@Resolver(() => Cv)
export class CvsResolver {
  constructor(
    private readonly cvsService: CvsService,
    private readonly skillsService: SkillsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

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
    return this.cvsService.create({
      userId: user.id,
      ...createCvInput,
      path,
    });
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
  updateCv(
    @Args('updateCvInput') updateCvInput: UpdateCvInput,
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User,
  ) {
    return this.cvsService.update(id, { ...updateCvInput, userId: user.id });
  }

  @Mutation(() => Cv)
  removeCv(@Args('id', { type: () => ID }) id: string, @GetUser() user: User) {
    return this.cvsService.deleteCv(id, user.id);
  }
}
