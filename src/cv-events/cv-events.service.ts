import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CvEventsService {
  constructor(private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async logEvent(cvId: string, userId: string, type: 'CREATE' | 'UPDATE' | 'DELETE') {
    await this.prisma.cvEvent.create({
      data: {
        type,
        cvId,
        userId,
        timestamp: new Date(),
      }
    });
    this.eventEmitter.emit(`CV.${type}`, {
      type,
      cvId,
      userId,
      timestamp: new Date(),
    });
  }

    async getHistoryForCv(cvId: string) {
        return this.prisma.cvEvent.findMany({
        where: { cvId },
        orderBy: { timestamp: 'desc' },
        });
    }

    async getHistoryForUser(userId: string) {
        return this.prisma.cvEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        });
    }
}