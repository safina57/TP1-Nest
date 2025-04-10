// src/cv/dto/update-cv.dto.ts
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateCvDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  cin?: string;

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsString()
  path?: string;
}