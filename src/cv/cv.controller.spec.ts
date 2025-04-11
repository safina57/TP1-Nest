import { Test, TestingModule } from '@nestjs/testing';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { BadRequestException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

describe('CvController', () => {
  let controller: CvController;
  let cvService: CvService;
  let fileUploadService: FileUploadService;

  const mockCvService = {
    findByQuery: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockFileUploadService = {
    saveImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvController],
      providers: [
        { provide: CvService, useValue: mockCvService },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    controller = module.get<CvController>(CvController);
    cvService = module.get<CvService>(CvService);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCV', () => {
    it('should return result from cvService.findByQuery', async () => {
      const query = { string: 'John' };
      const result = [{ id: '1', string: 'John' }];
      mockCvService.findByQuery.mockResolvedValue(result);
      expect(await controller.getCV(query)).toEqual(result);
    });
  });

  describe('createCV', () => {
    it('should throw if no userId is provided', async () => {
      const body = { name: 'Test' };
      await expect(controller.createCV(body as any)).rejects.toThrow(BadRequestException);
    });

    it('should call cvService.create with correct params', async () => {
      const body = { userId: '123', name: 'Test' } as CreateCvDto & { userId: string };
      const expectedResult = { id: 'cv1' };
      mockCvService.create.mockResolvedValue(expectedResult);

      expect(await controller.createCV(body)).toEqual(expectedResult);
      expect(mockCvService.create).toHaveBeenCalledWith({ name: 'Test' }, '123');
    });
  });

  describe('updateCV', () => {
    it('should throw if no userId is provided', async () => {
      const body = { name: 'Updated' };
      await expect(controller.updateCV('cv1', body as any)).rejects.toThrow(BadRequestException);
    });

    it('should call cvService.update with correct params', async () => {
      const body = { userId: '123', name: 'Updated' } as UpdateCvDto & { userId: string };
      const result = { id: 'cv1', name: 'Updated' };
      mockCvService.update.mockResolvedValue(result);

      expect(await controller.updateCV('cv1', body)).toEqual(result);
      expect(mockCvService.update).toHaveBeenCalledWith('cv1', { name: 'Updated' }, '123');
    });
  });

  describe('deleteCV', () => {
    it('should throw if no userId is provided', async () => {
      await expect(controller.deleteCV('cv1', undefined as any)).rejects.toThrow(BadRequestException);
    });

    it('should call cvService.remove with correct params', async () => {
      const result = { deleted: true };
      mockCvService.remove.mockResolvedValue(result);

      expect(await controller.deleteCV('cv1', '123')).toEqual(result);
      expect(mockCvService.remove).toHaveBeenCalledWith('cv1', '123');
    });
  });

  describe('uploadImage', () => {
    it('should call fileUploadService.saveImage and return the saved path', async () => {
      const mockFile = { originalname: 'test.png' } as Express.Multer.File;
      mockFileUploadService.saveImage.mockResolvedValue('uploads/test.png');

      const response = await controller.uploadImage(mockFile);
      expect(response).toEqual({
        message: 'Image uploaded successfully',
        path: 'uploads/test.png',
      });
      expect(mockFileUploadService.saveImage).toHaveBeenCalledWith(mockFile);
    });
  });
});
