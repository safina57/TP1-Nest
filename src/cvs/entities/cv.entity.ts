import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Cv {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
