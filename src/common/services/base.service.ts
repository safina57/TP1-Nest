import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

Injectable()
export class BaseService<T> {
  constructor(
    protected prisma: PrismaService,
    protected model: keyof PrismaService 
  ) {}

  async create(data: any): Promise<T> {
    return (this.prisma[this.model] as any).create({ data });
  }

  async findAll(): Promise<T[]> {
    return (this.prisma[this.model] as any).findMany();
  }

  async findOne(id: String): Promise<T> {
    return (this.prisma[this.model] as any).findUnique({ where: { id } });
  }

  async update(id: String, data: any): Promise<T> {
    return (this.prisma[this.model] as any).update({ where: { id }, data });
  }

  async remove(id: String): Promise<T> {
    return (this.prisma[this.model] as any).delete({ where: { id } });
  }
}
