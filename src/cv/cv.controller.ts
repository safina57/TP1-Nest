// src/cv/cv.controller.ts
import { 
  Controller, 
  Get, Post, Put, Delete, 
  Query, Body, Param, 
  UseGuards , 
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GetCvQueryDto } from './dto/get-cv-query.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust path based on your structure
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ImageValidationPipe } from '../file-upload/pipes/image_validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import {  BadRequestException } from '@nestjs/common';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';


// Custom decorator to extract userId from JWT payload
export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user.userId; // Assumes userId is in request.user.userId from JwtStrategy
});



@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  getCV(@Query() query: GetCvQueryDto) {
    return this.cvService.findByQuery(query);
  }

  @Post()
  createCV(@Body() body: CreateCvDto & { userId: string }) {
    // Validate that the request body exists and contains a userId,
    if (!body || !body.userId) {
      throw new BadRequestException('userId is required');
    }
    const { userId, ...createCvDto } = body;
    return this.cvService.create(createCvDto, userId);
  }

  @Put(':id')
  updateCV(@Param('id') id: string, @Body() body: UpdateCvDto & { userId: string }) {
    // Validate that the request body exists and contains a userId,
    if (!body || !body.userId) {
      throw new BadRequestException('userId is required');
    }
    const { userId, ...updateCvDto } = body;
    return this.cvService.update(id, updateCvDto, userId);
  }

  @Delete(':id')
  deleteCV(@Param('id') id: string, @Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.cvService.remove(id, userId);
  }

  // TODO @safina57 UseGuards(JwtAuthGuard) Guards are commented out for now
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File
  ) {
    const savedImagePath = await this.fileUploadService.saveImage(file);
    return { message: 'Image uploaded successfully', path: savedImagePath };
  }
}