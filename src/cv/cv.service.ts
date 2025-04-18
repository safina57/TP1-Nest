// src/cv/cv.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Cv } from '@prisma/client'; 
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetCvQueryDto } from './dto/get-cv-query.dto';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  // Searches for CVs where the search string matches in name, firstName, or job and/or the age matches
  async findByQuery(query: GetCvQueryDto): Promise<Cv[]> {
    const { string, age } = query;
    const where: any = {};

    if (string) {
      // Check if a CV matches any of these conditions
      where.OR = [
        // Matches if the name field contains the search string
        { name: { contains: string, mode: 'insensitive' } },
        // Matches if the firstName field contains the search string
        { firstName: { contains: string, mode: 'insensitive' } },
        // Matches if the job field contains the search string
        { job: { contains: string, mode: 'insensitive' } },
      ];
    }

    if (age) {
      where.age = age;
    }

    return this.prisma.cv.findMany({
      where,
    });
  }

  // Look for a CV via its ID
  async findOne(id: string): Promise<Cv | null> {
    return this.prisma.cv.findUnique({
      //filter to define the search criteria
      where: { id },
    });
  }

  // Create a new CV
  async create(createCvDto: CreateCvDto, userId: string): Promise<Cv> {
    return this.prisma.cv.create({
      data: {
        // Copy all the fields from DTO into the new CV
        ...createCvDto,
        path: '', // Set path to empty string for now
        userId, // Add userId to satisfy the required field in the Cv model
      },
    });
  }

  // Update a CV via its ID
  // Only the user that inserted the CV can update it
  async update(id: string, updateCvDto: UpdateCvDto, userId: string): Promise<Cv> {
    const cv = await this.findOne(id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (cv.userId !== userId) {
      throw new ForbiddenException('You can only update your own CV');
    }
    return this.prisma.cv.update({
      where: { id },
      data: updateCvDto,
    });
  }

  // Delete a CV via its ID
  // Only the user that inserted the CV can delete it
  async remove(id: string, userId: string): Promise<void> {
    const cv = await this.prisma.cv.findUnique({ where: { id } });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (cv.userId !== userId) {
      throw new ForbiddenException('You can only delete your own CV');
    }
    await this.prisma.cv.delete({ where: { id } });
  }
}