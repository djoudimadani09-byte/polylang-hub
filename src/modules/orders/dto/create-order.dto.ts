import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  sourceLanguage: string;

  @IsString()
  targetLanguage: string;

  @IsString()
  fileUrl: string;

  @IsString()
  fileName: string;

  @IsNumber()
  fileSize: number;

  @IsString()
  documentType: string;

  @IsNumber()
  wordCount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
