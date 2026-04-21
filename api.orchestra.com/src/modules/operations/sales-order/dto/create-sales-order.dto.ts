import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddonSelectionDto } from '@/modules/addons/dto/addon-selection.dto';

export class CreateSalesOrderItemDto {
  @ApiProperty({ example: 1, description: 'Item ID' })
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ example: 10, description: 'Quantity' })
  @IsNumber()
  @Min(0.000001)
  quantity: number;

  @ApiProperty({ example: 1, description: 'Unit of Measure ID' })
  @IsNumber()
  @IsNotEmpty()
  unitOfMeasureId: number;

  @ApiProperty({ example: 100, description: 'Unit Price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 5, description: 'Discount Percent' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiPropertyOptional({ example: 10, description: 'Tax Percent' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxPercent?: number;

  @ApiProperty({ example: 1, description: 'Warehouse ID' })
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty({ example: 1, description: 'Location ID' })
  @IsNumber()
  @IsNotEmpty()
  locationId: number;

  @ApiPropertyOptional({ description: 'Notes for the item' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 1, description: 'Service Type ID' })
  @IsOptional()
  @IsNumber()
  serviceTypeId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Service Option ID' })
  @IsOptional()
  @IsNumber()
  serviceOptionId?: number;

  @ApiPropertyOptional({ example: 'CUSTOMER', description: 'Label Source' })
  @IsOptional()
  @IsString()
  labelSource?: string;

  @ApiPropertyOptional({
    description: 'Add-ons for this item',
    type: [AddonSelectionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonSelectionDto)
  addons?: AddonSelectionDto[];
}

export class CreateSalesOrderDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer Name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '2024-01-15', description: 'Order Date' })
  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @ApiPropertyOptional({ example: '2024-01-20', description: 'Delivery Date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveryDate?: Date;

  @ApiPropertyOptional({
    example: 'Urgent delivery requested',
    description: 'Order Notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateSalesOrderItemDto], description: 'Order Items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderItemDto)
  items: CreateSalesOrderItemDto[];
}
