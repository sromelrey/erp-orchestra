import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FindStockTransferDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  transferNumber?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sourceWarehouseId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  destinationWarehouseId?: number;

  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED'])
  status?: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  transferDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  transferDateTo?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  expectedDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  expectedDateTo?: Date;
}
