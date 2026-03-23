import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CostingMethod } from '@/types/enums';

export class CalculateBomCostDto {
  @IsInt()
  bomId: number;

  @IsOptional()
  @IsEnum(CostingMethod)
  costingMethod?: CostingMethod = CostingMethod.STANDARD;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  outputQuantity?: number = 1;

  @IsOptional()
  @IsString()
  costUom?: string = 'EA';

  @IsOptional()
  @IsDateString()
  costDate?: string;

  @IsOptional()
  @IsBoolean()
  includeScrap?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeLabor?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeOverhead?: boolean = true;

  @IsOptional()
  @IsString()
  notes?: string;
}
