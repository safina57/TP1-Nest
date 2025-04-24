import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Cv } from 'src/cvs/entities/cv.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username?: string;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  password?: string;

  @Field(() => String)
  role?: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => [Cv])
  cvs?: Cv[];
}
