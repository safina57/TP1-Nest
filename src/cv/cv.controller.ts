// src/cv/cv.controller.ts
import { Controller, Get, Post, Put, Delete, Query, Body, Param, BadRequestException } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GetCvQueryDto } from './dto/get-cv-query.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

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
}