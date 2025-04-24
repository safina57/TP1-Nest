import { CreateCvInput } from './create-cv.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCvInput extends PartialType(CreateCvInput) {
}
