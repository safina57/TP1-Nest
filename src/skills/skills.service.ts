import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { BaseService } from 'src/common/services/base.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillsService extends BaseService<Skill>{
  constructor(
    readonly prisma: PrismaService
  ) {
    super(prisma, 'skill');
  }
  
  getSkillsByCvId(cvId: string): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: {
        cvs: {
          some: {
            id: cvId,
          },
        },
      },
    });
  }
}
