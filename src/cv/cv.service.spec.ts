
// src/cv/cv.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { BadRequestException } from '@nestjs/common';

const mockService = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CvController', () => {
  let controller: CvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvController],
      providers: [
        { provide: CvService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<CvController>(CvController);
  });

  it('should throw if no userId is provided (create)', async () => {
    await expect(controller.createCV({ name: 'test' } as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw if no userId is provided (update)', async () => {
    await expect(controller.updateCV('1', { name: 'test' } as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw if no userId is provided (delete)', async () => {
    await expect(controller.deleteCV('1', '')).rejects.toThrow(BadRequestException);
  });
});