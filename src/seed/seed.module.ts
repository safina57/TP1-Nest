import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [SeedService, PrismaService, ConfigService],
})
export class SeedModule {}
