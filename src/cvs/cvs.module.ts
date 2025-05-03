import { Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsResolver } from './cvs.resolver';
import { SkillsService } from 'src/skills/skills.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';

@Module({
  imports: [FileUploadModule, PubSubModule],
  providers: [CvsResolver, CvsService, SkillsService],
})
export class CvsModule {}
