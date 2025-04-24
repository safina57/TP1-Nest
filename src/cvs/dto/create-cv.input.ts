import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
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
}
