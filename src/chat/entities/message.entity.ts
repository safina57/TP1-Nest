import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  sender: string;

  @Field()
  content: string;

  @Field()
  timestamp: Date;

  @Field({ nullable: true })
  replyTo?: string;

  @Field(() => [String])
  reactions: any; 
}
