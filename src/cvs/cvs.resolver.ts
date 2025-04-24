import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { CvsService } from './cvs.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillsService } from 'src/skills/skills.service';

@Resolver(() => Cv)
export class CvsResolver {
  constructor(
    private readonly cvsService: CvsService,
    private readonly skillsService: SkillsService
  ) {}

  @Mutation(() => Cv)
  createCv(@Args('createCvInput') createCvInput: CreateCvInput) {
    return this.cvsService.create(createCvInput);
  }

  @Query(() => [Cv], { name: 'cvs' })
  findAll() {
    return this.cvsService.findAll();
  }

  @Query(() => Cv, { name: 'cv' })
  findOne(@Args('id', { type: () => ID }) id: String) {
    return this.cvsService.findOne(id);
  }

  @ResolveField('skills', () => [Skill])
  async skills(@Parent() cv: Cv) {
    return this.skillsService.getSkillsByCvId(cv.id);
  }
  
  @Mutation(() => Cv)
  updateCv(@Args('updateCvInput') updateCvInput: UpdateCvInput) {
    return this.cvsService.update(updateCvInput.id, updateCvInput);
  }

  @Mutation(() => Cv)
  removeCv(@Args('id', { type: () => ID }) id: String) {
    return this.cvsService.remove(id);
  }
}
