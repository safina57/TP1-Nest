import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Cv {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  firstName: string;

  @Field(() => Int)
  age: number;

  @Field(() => String)
  cin: string;

  @Field(() => String)
  job: string;

  @Field(() => String)
  path: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

}
