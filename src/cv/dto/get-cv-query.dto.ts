// src/cv/dto/get-cv-query.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCvQueryDto {
  @IsOptional()
  @IsString()
  //used for searching
  string?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  age?: number;
}