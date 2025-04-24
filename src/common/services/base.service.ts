import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

Injectable();
export class BaseService<M extends keyof PrismaService> {
  constructor(
    protected prisma: PrismaService,
    protected model: M,
  ) {}

  create(data: any): Promise<M> {
    return (this.prisma[this.model] as any).create({ data });
  }

  findAll(): Promise<M[]> {
    return (this.prisma[this.model] as any).findMany();
  }

  findOne(id: string): Promise<M> {
    return (this.prisma[this.model] as any).findUnique({ where: { id } });
  }

  update(id: string, data: any): Promise<M> {
    return (this.prisma[this.model] as any).update({
      where: { id },
      data,
    });
  }

  remove(id: string): Promise<M> {
    return (this.prisma[this.model] as any).delete({ where: { id } });
  }
}
