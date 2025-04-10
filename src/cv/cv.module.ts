import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service'; 
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [CvController],
  providers: [CvService, PrismaService],
  exports: [CvService], 
  imports: [FileUploadModule],
})
export class CvModule {}