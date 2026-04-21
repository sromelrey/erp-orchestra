import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportSalesOrderRowDto {
  @ApiProperty({
    description: 'Order number to group rows into one order',
    example: 'SO-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  order_no: string;

  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @ApiProperty({
    description: 'Order date (ISO string)',
    example: '2024-01-15',
  })
  @IsDateString()
  order_date: string;

  @ApiProperty({ description: 'Item code', example: 'FG-TSHIRT-001' })
  @IsString()
  @IsNotEmpty()
  item_code: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  @IsNumber()
  @Min(0.000001)
  quantity: number;

  @ApiProperty({ description: 'Unit of measure code', example: 'PCS' })
  @IsString()
  @IsNotEmpty()
  uom_code: string;

  @ApiProperty({ description: 'Warehouse code', example: 'WH-MAIN' })
  @IsString()
  @IsNotEmpty()
  warehouse_code: string;

  @ApiPropertyOptional({ description: 'Location code', example: 'A-01' })
  @IsOptional()
  @IsString()
  location_code?: string;

  @ApiPropertyOptional({ description: 'Unit price', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unit_price?: number;
}

export class ImportSalesOrdersDto {
  @ApiProperty({
    type: [ImportSalesOrderRowDto],
    description: 'Flat rows from Excel, grouped by order_no',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportSalesOrderRowDto)
  rows: ImportSalesOrderRowDto[];

  @ApiPropertyOptional({
    description: 'Auto-confirm imported orders',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoConfirm?: boolean;

  @ApiPropertyOptional({
    description: 'Skip duplicate order_no (default: true)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  skipExisting?: boolean;

  @ApiPropertyOptional({
    description: 'Auto-create item if item_code does not exist',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoCreateItems?: boolean;

  @ApiPropertyOptional({
    description: 'Run full workflow: confirm → ship → deliver',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoComplete?: boolean;

  @ApiPropertyOptional({
    description: 'Group rows by customer_name+order_date instead of order_no',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  groupByCustomerDate?: boolean;

  @ApiPropertyOptional({
    description: 'Group rows by order_no (default: true)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  groupByOrderNo?: boolean;

  @ApiPropertyOptional({
    description: 'Validate only without inserting data',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  validateOnly?: boolean;
}

export interface ImportSalesOrderResult {
  totalOrders: number;
  success: number;
  failed: number;
  skipped: number;
  itemsCreated: number;
  rowsProcessed: number;
  groupedOrders: number;
  valid: number;
  invalid: number;
  errors: ImportSalesOrderError[];
}

export interface ImportSalesOrderError {
  orderNo: string;
  row?: number;
  field?: string;
  message: string;
  original?: string;
  normalized?: string;
}
