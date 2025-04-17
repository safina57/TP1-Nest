import { Module } from '@nestjs/common';
import { GenericService } from './services/generic.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [GenericService, PrismaService],
  exports: [GenericService],
})
export class CommonModule {}
