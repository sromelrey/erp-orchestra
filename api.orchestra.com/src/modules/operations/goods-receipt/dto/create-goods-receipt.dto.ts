import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GoodsReceiptType } from '@/entities';

export class CreateGoodsReceiptItemDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({
    description: 'Unit of Measure ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  uomId: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantityOrdered: number;

  @ApiPropertyOptional({
    description: 'Quantity received (can be 0 for draft)',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantityReceived?: number;

  @ApiPropertyOptional({
    description: 'Unit price',
    example: 10.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiPropertyOptional({
    description: 'Total price (calculated if not provided)',
    example: 1050,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Batch number for tracking',
    example: 'BATCH-2024-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  batchNumber?: string;

  @ApiPropertyOptional({
    description: 'Expiry date for batched items',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiPropertyOptional({
    description: 'Line item notes',
    example: 'Received in good condition',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class CreateGoodsReceiptDto {
  @ApiProperty({
    description: 'Type of goods receipt',
    enum: GoodsReceiptType,
    example: GoodsReceiptType.PURCHASE_ORDER,
  })
  @IsEnum(GoodsReceiptType)
  @IsNotEmpty()
  receiptType: GoodsReceiptType;

  @ApiPropertyOptional({
    description: 'Reference document type (e.g., PO, SO)',
    example: 'PURCHASE_ORDER',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceType?: string;

  @ApiPropertyOptional({
    description: 'Reference document number',
    example: 'PO-2024-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceCode?: string;

  @ApiPropertyOptional({
    description: 'Supplier ID (for PO receipts)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @ApiProperty({
    description: 'Warehouse ID where items will be received',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @ApiPropertyOptional({
    description: 'Specific location within warehouse',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  locationId?: number;

  @ApiPropertyOptional({
    description: 'Receipt date (defaults to today)',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  receiptDate?: Date;

  @ApiPropertyOptional({
    description: 'Expected delivery date',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDate?: Date;

  @ApiPropertyOptional({
    description: 'General notes for the receipt',
    example: 'Urgent delivery - expedite processing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({
    description: 'Array of receipt line items',
    type: [CreateGoodsReceiptItemDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGoodsReceiptItemDto)
  items: CreateGoodsReceiptItemDto[];
}
