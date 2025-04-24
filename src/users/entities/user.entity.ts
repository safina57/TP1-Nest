import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Cv } from 'src/cvs/entities/cv.entity';
import { Role } from '../enums/role.enum';

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

  @Field(() => Role)
  role?: Role;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => [Cv])
  cvs?: Cv[];
}
