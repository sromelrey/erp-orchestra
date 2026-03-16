import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'ITEM-001', maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  code: string;

  @ApiProperty({ example: 'Widget', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'A sample item' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  baseUomId: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
