import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageInput } from './dto/create-message.input';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  saveMessage(input: CreateMessageInput) {
    return this.prisma.message.create({
      data: {
        sender: input.sender,
        content: input.content,
        replyTo: input.replyTo ?? null,
        reactions: {},
      },
    });
  }

  getAllMessages() {
    return this.prisma.message.findMany({
      orderBy: { timestamp: 'asc' },
    });
  }

  async addReaction(messageId: string, emoji: string, userId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message) {
      throw new Error('Message not found');
    }
    const reactions = message.reactions || {};

    if (!reactions[emoji]) reactions[emoji] = [];
    if (!reactions[emoji].includes(userId)) {
      reactions[emoji].push(userId);
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { reactions },
    });
  }
}
