import { Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsResolver } from './cvs.resolver';
import { SkillsService } from 'src/skills/skills.service';

@Module({
  providers: [CvsResolver, CvsService, SkillsService],
})
export class CvsModule {}
