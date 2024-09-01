import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Rooms } from '../Models/Rooms';
@Injectable()
export class RoomService {
  private rooms: Rooms[] = [];

  createRoom(name: string): string {
    const roomId = uuid();
    const room = new Rooms();
    room.id = roomId;
    room.name = name;
    this.rooms.push(room);
    return roomId;
  }

  getRooms(): Rooms[] {
    return this.rooms;
  }
}
