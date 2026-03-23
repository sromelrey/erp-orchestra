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

export class UpdateBomCostingDto {
  @IsOptional()
  @IsEnum(CostingMethod)
  costingMethod?: CostingMethod;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalMaterialCost?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalLaborCost?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalOverheadCost?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  outputQuantity?: number;

  @IsOptional()
  @IsString()
  costUom?: string;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  changeReason?: string;
}

export class UpdateBomCostComponentDto {
  @IsInt()
  componentMaterialId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  unitCost?: number;

  @IsOptional()
  @IsString()
  costSource?: string;

  @IsOptional()
  @IsDateString()
  costDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
