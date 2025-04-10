// src/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';

@Module({
  controllers: [CvController],
  providers: [CvService, PrismaService],
  exports: [CvService], 
  imports: [FileUploadModule],
})
export class CvModule {}