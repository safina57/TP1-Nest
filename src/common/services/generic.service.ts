import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenericService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll<T extends keyof PrismaService>(
    model: T,
    user: User,
    options: {
      skip?: number;
      take?: number;
    } = {},
  ): Promise<any[]> {
    const prismaModel = this.prisma[model] as any;

    if (!prismaModel?.findMany) {
      throw new Error(`Model "${String(model)}" does not exist`);
    }

    if (user.role !== 'admin') {
      return await prismaModel.findMany({
        skip: options.skip,
        take: options.take,
        where: {
          userId: user.id,
        },
      });
    }

    return await prismaModel.findMany({
      skip: options.skip,
      take: options.take,
    });
  }
}
