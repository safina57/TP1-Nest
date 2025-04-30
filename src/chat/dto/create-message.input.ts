import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  sender: string;

  @Field()
  content: string;

  @Field(() => ID, { nullable: true })
  replyTo?: string;
}
