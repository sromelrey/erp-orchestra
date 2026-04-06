import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockTransferItemDto {
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @IsNumber()
  @IsNotEmpty()
  quantityTransferred: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  batchNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateStockTransferDto {
  @IsNumber()
  @IsNotEmpty()
  sourceWarehouseId: number;

  @IsOptional()
  @IsNumber()
  sourceLocationId?: number;

  @IsNumber()
  @IsNotEmpty()
  destinationWarehouseId: number;

  @IsOptional()
  @IsNumber()
  destinationLocationId?: number;

  @IsDateString()
  @IsNotEmpty()
  transferDate: string;

  @IsOptional()
  @IsDateString()
  expectedDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockTransferItemDto)
  items: CreateStockTransferItemDto[];
}
