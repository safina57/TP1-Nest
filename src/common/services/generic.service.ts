import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenericService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll<
    T extends {
      [K in keyof PrismaService]: PrismaService[K] extends {
        findMany: (...args: any[]) => any;
      }
        ? K
        : never;
    }[keyof PrismaService],
  >(
    model: T,
    user: User,
    options: {
      skip?: number;
      take?: number;
    } = {},
  ): Promise<ReturnType<PrismaService[T]['findMany']>> {
    const prismaModel = this.prisma[model] as unknown as {
      findMany: (...args: any[]) => ReturnType<PrismaService[T]['findMany']>;
    };

    if (!prismaModel) {
      throw new Error(
        `Model "${String(model)}" does not exist or does not support "findMany"`,
      );
    }

    type QueryOptions = Parameters<PrismaService[T]['findMany']>[0];

    const queryOptions: QueryOptions = {
      skip: options.skip,
      take: options.take,
    };

    if (user.role !== 'admin') {
      queryOptions.where = { userId: user.id };
    }

    return prismaModel.findMany(queryOptions);
  }
}
