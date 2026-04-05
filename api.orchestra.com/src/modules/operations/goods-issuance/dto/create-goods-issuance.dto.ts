import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  GoodsIssuanceType,
  GoodsIssuanceReferenceType,
} from '@/entities/operations/goods-issuance.entity';

export class CreateGoodsIssuanceItemDto {
  @ApiProperty({ example: 1, description: 'Item ID' })
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ example: 1, description: 'Unit of Measure ID' })
  @IsNumber()
  @IsNotEmpty()
  uomId: number;

  @ApiProperty({ example: 50.5, description: 'Quantity to be issued' })
  @IsNumber()
  @Min(0.001)
  @IsNotEmpty()
  quantityIssued: number;

  @ApiPropertyOptional({ example: 10.5, description: 'Unit price' })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({ example: 530.25, description: 'Total price' })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @ApiPropertyOptional({
    example: 'BATCH-2024-001',
    description: 'Batch number',
  })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Expiry date' })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({
    example: 'For production line A',
    description: 'Item notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateGoodsIssuanceDto {
  @ApiProperty({ enum: GoodsIssuanceType, description: 'Type of issuance' })
  @IsEnum(GoodsIssuanceType)
  @IsNotEmpty()
  issuanceType: GoodsIssuanceType;

  @ApiPropertyOptional({
    enum: GoodsIssuanceReferenceType,
    description: 'Reference document type',
  })
  @IsEnum(GoodsIssuanceReferenceType)
  @IsOptional()
  referenceType?: GoodsIssuanceReferenceType;

  @ApiPropertyOptional({
    example: 'PO-2024-001',
    description: 'Reference code',
  })
  @IsString()
  @IsOptional()
  referenceCode?: string;

  @ApiPropertyOptional({ example: 1, description: 'Department ID to issue to' })
  @IsNumber()
  @IsOptional()
  issuedToDepartmentId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Cost center ID' })
  @IsNumber()
  @IsOptional()
  costCenterId?: number;

  @ApiProperty({ example: 1, description: 'Warehouse ID' })
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @ApiPropertyOptional({ example: 2, description: 'Warehouse location ID' })
  @IsNumber()
  @IsOptional()
  locationId?: number;

  @ApiProperty({ example: '2024-01-15', description: 'Issuance date' })
  @IsDateString()
  @IsNotEmpty()
  issuanceDate: string;

  @ApiPropertyOptional({ example: '2024-01-20', description: 'Expected date' })
  @IsDateString()
  @IsOptional()
  expectedDate?: string;

  @ApiPropertyOptional({
    example: 'Issued for production order #123',
    description: 'Notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [CreateGoodsIssuanceItemDto],
    description: 'Items to issue',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGoodsIssuanceItemDto)
  @IsNotEmpty()
  items: CreateGoodsIssuanceItemDto[];
}
