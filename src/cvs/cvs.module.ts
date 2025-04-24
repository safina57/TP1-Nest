import { Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsResolver } from './cvs.resolver';
import { SkillsService } from 'src/skills/skills.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  providers: [CvsResolver, CvsService, SkillsService],
})
export class CvsModule {}
