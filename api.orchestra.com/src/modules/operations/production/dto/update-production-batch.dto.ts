import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionBatchDto } from './create-production-batch.dto';

export class UpdateProductionBatchDto extends PartialType(
  CreateProductionBatchDto,
) {
  @IsOptional()
  @IsNumber()
  actualQuantity?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
