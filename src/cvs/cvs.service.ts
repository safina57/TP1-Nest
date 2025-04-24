import { Injectable } from '@nestjs/common';
import { Cv } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreateCvInput } from './dto/create-cv.input';

@Injectable()
export class CvsService extends BaseService<Cv> {
  constructor(readonly prisma: PrismaService) {
    super(prisma, 'cv');
  }

  override create(data: CreateCvInput & { userId: string }): Promise<Cv> {
    return this.prisma.cv.create({
      data: {
        ...data,
        path: '',
      },
    });
  }

  getCvsByUserId(userId: string): Promise<Cv[]> {
    return this.prisma.cv.findMany({
      where: {
        userId,
      },
    });
  }

  getCvsBySkillId(skillId: string): Promise<Cv[]> {
    return this.prisma.cv.findMany({
      where: {
        skills: {
          some: {
            id: skillId,
          },
        },
      },
    });
  }
}
