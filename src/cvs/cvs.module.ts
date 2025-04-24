import { Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsResolver } from './cvs.resolver';

@Module({
  providers: [CvsResolver, CvsService],
})
export class CvsModule {}
