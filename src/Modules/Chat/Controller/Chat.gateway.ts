import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../Services/Chat.service';

@WebSocketGateway({ cors: true, transports: ['polling'] })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private users: Map<string, Socket> = new Map();

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Socket): any {
    this.chatService.subscribe('chat/#', (topic, message) => {
      console.log("Topic recieved");
      const room = topic.split('/')[1];
      server.to(room).emit('message', { topic, message: message.toString() });
    });
  }

  handleConnection(client: Socket): void {
    console.log("handle connections");
    const room: string = client.handshake.query.room as string;
    client.join(room);
  }

  handleDisconnect(client: Socket): void {
    const room: string = client.handshake.query.room as string;
    client.leave(room);
  }
}
