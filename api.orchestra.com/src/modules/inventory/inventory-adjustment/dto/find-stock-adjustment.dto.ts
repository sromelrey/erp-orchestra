import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StockAdjustmentType } from '@/types/enums';
import { Transform, TransformFnParams } from 'class-transformer';

export class FindStockAdjustmentDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    value ? parseInt(value as string) : undefined,
  )
  page?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    value ? parseInt(value as string) : undefined,
  )
  limit?: number;

  @IsOptional()
  @IsString()
  adjustmentNumber?: string;

  @IsOptional()
  @IsEnum(StockAdjustmentType)
  adjustmentType?: StockAdjustmentType;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    value ? parseInt(value as string) : undefined,
  )
  warehouseId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    value ? parseInt(value as string) : undefined,
  )
  locationId?: number;

  @IsOptional()
  @IsEnum(['DRAFT', 'APPROVED', 'CANCELLED'])
  status?: 'DRAFT' | 'APPROVED' | 'CANCELLED';

  @IsOptional()
  @IsDateString()
  adjustmentDateFrom?: string;

  @IsOptional()
  @IsDateString()
  adjustmentDateTo?: string;

  @IsOptional()
  @IsString()
  referenceType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    value ? parseInt(value as string) : undefined,
  )
  referenceId?: number;
}
