import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { StockMovementType } from '@/types/enums';

export class CreateStockMovementDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  warehouseId: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  locationId?: number;

  @ApiProperty({ example: 101 })
  @IsInt()
  itemId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  uomId: number;

  @ApiProperty({ example: 25.5 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(0)
  quantity: number;

  @ApiProperty({ enum: StockMovementType, example: StockMovementType.RECEIPT })
  @IsEnum(StockMovementType)
  movementType: StockMovementType;

  @ApiPropertyOptional({ maxLength: 64, example: 'PO' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceType?: string;

  @ApiPropertyOptional({ maxLength: 64, example: 'PO-2026-0001' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceCode?: string;

  @ApiPropertyOptional({ example: 'Initial receipt' })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiPropertyOptional({ example: '2026-03-16T08:30:00Z' })
  @IsOptional()
  @IsDateString()
  documentDate?: string;
}
