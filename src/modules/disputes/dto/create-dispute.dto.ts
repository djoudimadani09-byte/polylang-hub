import { IsString } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  orderId: string;

  @IsString()
  reportedBy: string;

  @IsString()
  reason: string;

  @IsString()
  description: string;
}
