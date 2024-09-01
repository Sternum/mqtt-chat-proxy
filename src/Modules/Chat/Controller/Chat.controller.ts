import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChatService } from '../Services/Chat.service';
import { SendMessagePayload } from './SendMessage.payload';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async send(@Body() payload: SendMessagePayload): Promise<void> {
    this.chatService.publish(payload.topic, payload.message);
  }
}
