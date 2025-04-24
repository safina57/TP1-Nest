import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { SkillsService } from './skills.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { Cv } from 'src/cvs/entities/cv.entity';
import { CvsService } from 'src/cvs/cvs.service';

@Resolver(() => Skill)
export class SkillsResolver {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly cvsService: CvsService
  ) {}

  @Mutation(() => Skill)
  createSkill(@Args('createSkillInput') createSkillInput: CreateSkillInput) {
    return this.skillsService.create(createSkillInput);
  }

  @Query(() => [Skill], { name: 'skills' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Query(() => Skill, { name: 'skill' })
  findOne(@Args('id', { type: () => ID }) id: String) {
    return this.skillsService.findOne(id);
  }

  @ResolveField('cvs', () => [Cv])
  async cvs(@Parent() skill: Skill) {
    return this.cvsService.getCvsBySkillId(skill.id);
  }
  @Mutation(() => Skill)
  updateSkill(@Args('updateSkillInput') updateSkillInput: UpdateSkillInput) {
    return this.skillsService.update(updateSkillInput.id, updateSkillInput);
  }

  @Mutation(() => Skill)
  removeSkill(@Args('id', { type: () => ID }) id: String) {
    return this.skillsService.remove(id);
  }
}
