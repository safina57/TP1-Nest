import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { Module } from '@nestjs/common';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [CvsController],
  providers: [CvsService, PrismaService],
  exports: [CvsService],
  imports: [FileUploadModule, CommonModule],
})
export class CvsModule {}
