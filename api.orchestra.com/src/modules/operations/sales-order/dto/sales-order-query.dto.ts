import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SalesOrderStatus } from '@/entities/operations/sales-order.entity';

export class SalesOrderQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'DRAFT', description: 'Filter by status' })
  @IsOptional()
  @IsEnum(SalesOrderStatus)
  status?: SalesOrderStatus;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Filter by customer name',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    example: 'SO-2024-001',
    description: 'Filter by order number',
  })
  @IsOptional()
  @IsString()
  orderNo?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter by order date from',
  })
  @IsOptional()
  @Type(() => Date)
  orderDateFrom?: Date;

  @ApiPropertyOptional({
    example: '2024-01-31',
    description: 'Filter by order date to',
  })
  @IsOptional()
  @Type(() => Date)
  orderDateTo?: Date;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'DESC', description: 'Sort order' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
