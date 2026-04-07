import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSalesOrderDto {
  @ApiPropertyOptional({
    example: 'John Doe Updated',
    description: 'Customer Name',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ example: '2024-01-16', description: 'Order Date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

  @ApiPropertyOptional({ example: '2024-01-21', description: 'Delivery Date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveryDate?: Date;

  @ApiPropertyOptional({ example: 'Updated notes', description: 'Order Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 50, description: 'Discount Amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ example: 10, description: 'Tax Amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;
}
