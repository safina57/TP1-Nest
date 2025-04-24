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
import { User } from '@prisma/client';
import { ImageValidationPipe } from 'src/file-upload/pipes/image_validation.pipe';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import * as fs from 'fs';

@Resolver(() => Cv)
export class CvsResolver {
  constructor(
    private readonly cvsService: CvsService,
    private readonly skillsService: SkillsService,
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
    const { createReadStream, filename } = file;

    const uploadDir = `${process.cwd()}/public/uploads`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueName = `${Date.now()}-${filename}`;
    const path = `${uploadDir}/${uniqueName}`;

    const stream = createReadStream();
    const writeStream = fs.createWriteStream(path);

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      stream.on('end', resolve);
      stream.on('error', (error) => {
        writeStream.close();
        reject(error);
      });
    });

    return this.cvsService.create({
      userId: user.id,
      ...createCvInput,
      path,
    });
  }

  @Query(() => [Cv], { name: 'cvs' })
  findAll() {
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
  updateCv(@Args('updateCvInput') updateCvInput: UpdateCvInput) {
    return this.cvsService.update(updateCvInput.id, updateCvInput);
  }

  @Mutation(() => Cv)
  removeCv(@Args('id', { type: () => ID }) id: string) {
    return this.cvsService.remove(id);
  }
}
