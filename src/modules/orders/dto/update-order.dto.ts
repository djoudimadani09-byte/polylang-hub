import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
