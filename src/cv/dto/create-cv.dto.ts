import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  age: number;

  @IsNotEmpty()
  @IsString()
  cin: string;

  @IsNotEmpty()
  @IsString()
  job: string;
}
