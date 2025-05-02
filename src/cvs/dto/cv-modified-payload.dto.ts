import { ObjectType, Field } from '@nestjs/graphql';
import { Cv } from '../entities/cv.entity';

@ObjectType()
export class CvModifiedPayload {
  @Field()
  type: string;

  @Field(() => Cv)
  cv: Cv;
}