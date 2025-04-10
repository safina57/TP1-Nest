// src/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path based on your structure

@Module({
  controllers: [CvController],
  providers: [CvService, PrismaService],
  exports: [CvService], // Optional: export CvService if other modules need it
})
export class CvModule {}