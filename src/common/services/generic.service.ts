import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenericService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll<T extends keyof PrismaService>(
    model: T,
    options: {
      skip?: number;
      take?: number;
    } = {},
  ): Promise<any[]> {
    const prismaModel = this.prisma[model] as any;

    if (!prismaModel?.findMany) {
      throw new Error(`Model "${String(model)}" does not exist`);
    }

    return prismaModel.findMany({
      skip: options.skip,
      take: options.take,
    });
  }
}