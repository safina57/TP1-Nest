import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CvEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async logEvent(cvId: string, userId: string, type: 'CREATE' | 'UPDATE' | 'DELETE') {
    return this.prisma.cvEvent.create({
      data: {
        type,
        cvId,
        userId,
        timestamp: new Date(),
      }
    });
  }
}