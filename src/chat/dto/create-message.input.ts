import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  sender: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  replyTo?: string;
}