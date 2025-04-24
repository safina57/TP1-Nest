import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cv } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';

@Injectable()
export class CvsService extends BaseService<Cv> {
  constructor(readonly prisma: PrismaService) {
    super(prisma, 'cv');
  }

  override async create(
    data: CreateCvInput & { userId: string } & { path: string },
  ) {
    const { skillIds = [], ...rest } = data;
    return this.prisma.cv.create({
      data: {
        ...rest,
        skills: {
          connect: skillIds.map((skillId: string) => ({ id: skillId })),
        },
      },
    });
  }

  override async update(id: string, data: UpdateCvInput & { userId: string }) {
    const cv = await this.findOne(id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (cv.userId !== data.userId) {
      throw new UnauthorizedException('You are not allowed to update this CV');
    }

    const { skillIds = [], ...rest } = data;
    return this.prisma.cv.update({
      where: { id },
      data: {
        ...rest,
        skills: {
          set: skillIds.map((skillId: string) => ({ id: skillId })),
        },
      },
    });
  }

  async deleteCv(id: string, userId: string) {
    const cv = await this.findOne(id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (cv.userId !== userId) {
      throw new UnauthorizedException('You are not allowed to delete this CV');
    }
    return this.prisma.cv.delete({ where: { id } });
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
