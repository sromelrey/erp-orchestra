import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GoodsIssuanceType,
  GoodsIssuanceStatus,
} from '@/entities/operations/goods-issuance.entity';

export class FindGoodsIssuanceDto {
  @ApiPropertyOptional({
    enum: GoodsIssuanceStatus,
    description: 'Filter by status',
  })
  @IsEnum(GoodsIssuanceStatus)
  @IsOptional()
  status?: GoodsIssuanceStatus;

  @ApiPropertyOptional({
    enum: GoodsIssuanceType,
    description: 'Filter by issuance type',
  })
  @IsEnum(GoodsIssuanceType)
  @IsOptional()
  issuanceType?: GoodsIssuanceType;

  @ApiPropertyOptional({ example: 1, description: 'Filter by warehouse ID' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  warehouseId?: number;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter by date from',
  })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filter by date to',
  })
  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
