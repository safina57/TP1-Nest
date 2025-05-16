// src/cv-events/cv-events.module.ts
import { Module } from '@nestjs/common';
import { CvEventsService } from './cv-events.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CvEventsController } from './cv-events.controller';
@Module({
  providers: [CvEventsService, PrismaService],
  exports: [CvEventsService],
  controllers: [CvEventsController],
})
export class CvEventsModule {}
