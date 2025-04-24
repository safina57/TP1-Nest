import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsResolver } from './skills.resolver';
import { CvsService } from 'src/cvs/cvs.service';

@Module({
  providers: [SkillsResolver, SkillsService, CvsService],
})
export class SkillsModule {}
