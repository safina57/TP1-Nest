import { CreateCvInput } from './create-cv.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCvInput extends PartialType(CreateCvInput) {
  @Field(() => Int)
  id: number;
}
