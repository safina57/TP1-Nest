import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CvsService } from './cvs.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';

@Resolver(() => Cv)
export class CvsResolver {
  constructor(private readonly cvsService: CvsService) {}

  @Mutation(() => Cv)
  createCv(@Args('createCvInput') createCvInput: CreateCvInput) {
    return this.cvsService.create(createCvInput);
  }

  @Query(() => [Cv], { name: 'cvs' })
  findAll() {
    return this.cvsService.findAll();
  }

  @Query(() => Cv, { name: 'cv' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cvsService.findOne(id);
  }

  @Mutation(() => Cv)
  updateCv(@Args('updateCvInput') updateCvInput: UpdateCvInput) {
    return this.cvsService.update(updateCvInput.id, updateCvInput);
  }

  @Mutation(() => Cv)
  removeCv(@Args('id', { type: () => Int }) id: number) {
    return this.cvsService.remove(id);
  }
}
