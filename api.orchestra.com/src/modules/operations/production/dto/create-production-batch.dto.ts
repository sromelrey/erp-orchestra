import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductionWorkOrderDto } from './production-work-order.dto';

export class CreateProductionBatchDto {
  @IsNotEmpty()
  @IsNumber()
  bomId: number;

  @IsNotEmpty()
  @IsNumber()
  plannedQuantity: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductionWorkOrderDto)
  workOrders?: ProductionWorkOrderDto[];
}
