import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Cv, Prisma } from '@prisma/client';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetCvQueryDto } from './dto/get-cv-query.dto';

@Injectable()
export class CvsService {
  constructor(private prisma: PrismaService) {}

  async findByQuery(query: GetCvQueryDto): Promise<Cv[]> {
    const { string, age } = query;
    const where: Prisma.CvWhereInput = {};

    if (string) {
      where.OR = [
        { name: { contains: string, mode: 'insensitive' } },
        { firstName: { contains: string, mode: 'insensitive' } },
        { job: { contains: string, mode: 'insensitive' } },
      ];
    }

    if (age) {
      where.age = age;
    }

    return this.prisma.cv.findMany({
      where,
    });
  }

  async findOne(id: string): Promise<Cv | null> {
    return this.prisma.cv.findUnique({
      where: { id },
    });
  }

  async create(createCvDto: CreateCvDto, userId: string): Promise<Cv> {
    return this.prisma.cv.create({
      data: {
        ...createCvDto,
        path: '',
        userId,
      },
    });
  }

  async update(
    id: string,
    updateCvDto: UpdateCvDto,
    userId: string,
  ): Promise<Cv> {
    const cv = await this.findOne(id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (cv.userId !== userId) {
      throw new ForbiddenException('You can only update your own CV');
    }
    return this.prisma.cv.update({
      where: { id },
      data: updateCvDto,
    });
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const cv = await this.prisma.cv.findUnique({ where: { id } });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (cv.userId !== userId) {
      throw new ForbiddenException('You can only delete your own CV');
    }
    await this.prisma.cv.delete({ where: { id } });
    return { message: 'CV deleted successfully' };
  }
}
