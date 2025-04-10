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

  // Fetch CVs based on query params
  @Get()
  getCV(@Query() query: GetCvQueryDto) {
    return this.cvService.findByQuery(query);
  }

  // Create a new CV (authenticated user)
  // @UseGuards(JwtAuthGuard)
  @Post()
  createCV(@Body() createCvDto: CreateCvDto, @UserId() userId: string) {
    return this.cvService.create(createCvDto, userId);
  }

  // Update a CV (only by the owner)
  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateCV(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @UserId() userId: string) {
    return this.cvService.update(id, updateCvDto, userId);
  }

  // Delete a CV (only by the owner)
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteCV(@Param('id') id: string, @UserId() userId: string) {
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