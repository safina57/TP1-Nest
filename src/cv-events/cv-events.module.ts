// src/cv-events/cv-events.module.ts
import { Module } from '@nestjs/common';
import { CvEventsService } from './cv-events.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  providers: [CvEventsService, PrismaService],
  exports: [CvEventsService]
})
export class CvEventsModule {}
