import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  translationId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
