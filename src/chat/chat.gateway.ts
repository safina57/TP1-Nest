import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.loadHistory(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: { sender: string; message: string; replyTo?: string },
  ) {
    const saved = await this.chatService.saveMessage({
      sender: payload.sender,
      content: payload.message,
      replyTo: payload.replyTo,
    });

    this.server.emit('message', saved);
  }

  @SubscribeMessage('react')
  async handleReaction(
    @MessageBody() payload: { messageId: string; emoji: string; userId: string },
  ) {
    const updated = await this.chatService.addReaction(
      payload.messageId,
      payload.emoji,
      payload.userId,
    );

    this.server.emit('reactionUpdate', updated);
  }

  @SubscribeMessage('loadHistory')
  async loadHistory(client: Socket) {
    const history = await this.chatService.getAllMessages();
    client.emit('messageHistory', history);
  }
}
