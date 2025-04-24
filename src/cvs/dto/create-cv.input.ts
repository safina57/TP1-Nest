import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCvInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  firstName: string;

  @IsNotEmpty()
  @Field(() => Int)
  age: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  cin: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  job: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  path: string;

}
