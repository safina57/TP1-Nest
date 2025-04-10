import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
@Module({
  controllers: [CvController],
  providers: [CvService],
  imports: [FileUploadModule],
})
export class CvModule {}
