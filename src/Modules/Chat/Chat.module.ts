import { Module } from '@nestjs/common';
import { ChatService } from './Services/Chat.service';
import { ChatController } from './Controller/Chat.controller';
import { ChatGateway } from './Controller/Chat.gateway';
import { RoomService } from './Services/Room.service';
import { RoomController } from './Controller/Room.controller';

@Module({
  providers: [ChatService, ChatGateway, RoomService],
  controllers: [ChatController, RoomController],
})
export class ChatModule {}
