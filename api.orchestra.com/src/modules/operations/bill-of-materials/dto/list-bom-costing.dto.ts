import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CostingMethod } from '@/types/enums';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';

export class ListBomCostingDto extends CursorPaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  bomId?: number;

  @IsOptional()
  @IsEnum(CostingMethod)
  costingMethod?: CostingMethod;

  @IsOptional()
  @IsDateString()
  costingDateFrom?: string;

  @IsOptional()
  @IsDateString()
  costingDateTo?: string;

  @IsOptional()
  @IsString()
  componentMaterialCode?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeComponents?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  activeOnly?: boolean = true;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;
}
