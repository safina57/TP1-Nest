import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from './services/base.service';

@Module({
  providers: [BaseService, PrismaService],
  exports: [BaseService],
})
export class CommonModule {}
