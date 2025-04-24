import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateSkillInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  designation: string;
}
