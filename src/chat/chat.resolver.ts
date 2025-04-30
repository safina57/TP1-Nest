import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Resolver(() => Message)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Message)
  sendMessage(@Args('input') input: CreateMessageInput) {
    return this.chatService.saveMessage(input);
  }

  @Query(() => [Message])
  messages() {
    return this.chatService.getAllMessages();
  }
}
