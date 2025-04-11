import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './cv.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cv } from '@prisma/client';

describe('CvService', () => {
  let service: CvService;
  let prisma: PrismaService;

  const mockPrisma = {
    cv: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CvService>(CvService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findByQuery', () => {
    it('should call findMany with proper filters', async () => {
      const mockQuery = { string: 'dev', age: 30 };
      const expectedResult: Cv[] = [{ id: '1', name: 'dev', firstName: 'john', job: 'developer', age: 30, userId: 'u1' }];
      mockPrisma.cv.findMany.mockResolvedValue(expectedResult);

      const result = await service.findByQuery(mockQuery);
      expect(result).toEqual(expectedResult);
      expect(prisma.cv.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'dev', mode: 'insensitive' } },
            { firstName: { contains: 'dev', mode: 'insensitive' } },
            { job: { contains: 'dev', mode: 'insensitive' } },
          ],
          age: 30,
        },
      });
    });

    it('should handle empty query', async () => {
      mockPrisma.cv.findMany.mockResolvedValue([]);
      await expect(service.findByQuery({})).resolves.toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a CV by id', async () => {
      const mockCv = { id: 'cv1' } as Cv;
      mockPrisma.cv.findUnique.mockResolvedValue(mockCv);

      const result = await service.findOne('cv1');
      expect(result).toEqual(mockCv);
      expect(prisma.cv.findUnique).toHaveBeenCalledWith({ where: { id: 'cv1' } });
    });

    it('should return null if not found', async () => {
      mockPrisma.cv.findUnique.mockResolvedValue(null);
      const result = await service.findOne('unknown');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new CV', async () => {
      const dto = { name: 'Test' } as any;
      const mockCv = { id: '1', ...dto, userId: 'u1' };
      mockPrisma.cv.create.mockResolvedValue(mockCv);

      const result = await service.create(dto, 'u1');
      expect(result).toEqual(mockCv);
      expect(prisma.cv.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 'u1' },
      });
    });
  });

  describe('update', () => {
    it('should throw if CV not found', async () => {
      mockPrisma.cv.findUnique.mockResolvedValue(null);
      await expect(service.update('cv1', {}, 'u1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if user is not the owner', async () => {
      mockPrisma.cv.findUnique.mockResolvedValue({ id: 'cv1', userId: 'owner' });
      await expect(service.update('cv1', {}, 'intruder')).rejects.toThrow(ForbiddenException);
    });

    it('should update if user is owner', async () => {
      const existingCv = { id: 'cv1', userId: 'u1' };
      const updatedCv = { ...existingCv, job: 'Engineer' };
      mockPrisma.cv.findUnique.mockResolvedValue(existingCv);
      mockPrisma.cv.update.mockResolvedValue(updatedCv);

      const result = await service.update('cv1', { job: 'Engineer' }, 'u1');
      expect(result).toEqual(updatedCv);
    });
  });

  describe('remove', () => {
    it('should throw if CV not found', async () => {
      mockPrisma.cv.findUnique.mockResolvedValue(null);
      await expect(service.remove('cv1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if user is not the owner', async () => {
      mockPrisma.cv.findUnique.mockResolvedValue({ id: 'cv1', userId: 'owner' });
      await expect(service.remove('cv1', 'intruder')).rejects.toThrow(ForbiddenException);
    });

    it('should delete if user is owner', async () => {
      mockPrisma.cv.findUnique.mockResolvedValue({ id: 'cv1', userId: 'u1' });
      mockPrisma.cv.delete.mockResolvedValue(undefined);

      await expect(service.remove('cv1', 'u1')).resolves.toBeUndefined();
      expect(prisma.cv.delete).toHaveBeenCalledWith({ where: { id: 'cv1' } });
    });
  });
});
