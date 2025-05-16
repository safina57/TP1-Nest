import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  getAllMessages() {
    return this.chatService.getAllMessages();
  }

  @Post('message')
  sendMessage(@Body() input: { sender: string; content: string; replyTo?: string }) {
    return this.chatService.saveMessage(input);
  }
}
