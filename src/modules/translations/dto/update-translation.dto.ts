import { IsString } from 'class-validator';

export class UpdateTranslationDto {
  @IsString()
  draftText: string;
}
