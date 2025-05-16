import {
  Controller,
  UseGuards,
  Sse,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, filter, fromEvent, merge, map} from 'rxjs';

@Controller('cv-events')
export class CvEventsController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
  ){}
  @UseGuards(JWTAuthGuard)
  @Sse('sse')
  sse(@GetUser() user: User): Observable<MessageEvent>{
    const cvCreate = fromEvent(this.eventEmitter, 'CV.CREATE').pipe(
    filter((event: any) => {
      return user.role === 'admin' || event.userId === user.id;
    }),
    map((event) => new MessageEvent('CV.CREATE', { data: event }))
  );

  const cvUpdate = fromEvent(this.eventEmitter, 'CV.UPDATE').pipe(
    filter((event: any) => {
      return user.role === 'admin' || event.userId === user.id;
    }),
    map((event) => new MessageEvent('CV.UPDATE', { data: event }))
  );

  const cvDelete = fromEvent(this.eventEmitter, 'CV.DELETE').pipe(
    filter((event: any) => {
      return user.role === 'admin' || event.userId === user.id;
    }),
    map((event) => new MessageEvent('CV.DELETE', { data: event }))
  );

  return merge(cvCreate, cvUpdate, cvDelete); 
  }
}
