import { Body, Controller, Get, Post, Sse } from '@nestjs/common';
import { RoomService } from '../Services/Room.service';
import { Rooms } from '../Models/Rooms';
import { CreateRoomPayload } from './CreateRoom.payload';
import { fromEvent, interval, map, merge, Observable, startWith } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  createRoom(@Body() payload: CreateRoomPayload): Rooms[] {
    this.roomService.createRoom(payload.name);
    this.eventEmitter.emit('room-created');
    return this.roomService.getRooms();
  }

  @Get()
  getRooms(): Rooms[] {
    return this.roomService.getRooms();
  }

  @Sse('room-created')
  roomCreated(): Observable<MessageEvent> {
    const eventStream = fromEvent(this.eventEmitter, 'room-created').pipe(
      map(
        () =>
          new MessageEvent('room-created', {
            data: this.roomService.getRooms(),
          }),
      ),
    );

    const heartbeatStream = interval(15000).pipe(
      map(() => new MessageEvent('heartbeat', { data: 'keep-alive' })),
    );

    return merge(eventStream, heartbeatStream).pipe(
      startWith(new MessageEvent('heartbeat', { data: 'keep-alive' })),
    );
  }
}
