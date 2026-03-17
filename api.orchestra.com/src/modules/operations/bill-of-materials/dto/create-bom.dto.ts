import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBomLineDto {
  @ApiProperty({ description: 'Component item ID' })
  @IsInt()
  @Min(1)
  componentMaterialId: number;

  @ApiProperty({ description: 'Quantity required' })
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  quantity: number;

  @ApiPropertyOptional({ description: 'Unit of measure' })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  uom?: string;

  @ApiPropertyOptional({
    description: 'Scrap percentage (0-99.99)',
    example: 5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99.99)
  scrapPercentage?: number;

  @ApiPropertyOptional({ description: 'Sort order for display' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateBomDto {
  @ApiProperty({ description: 'BOM code' })
  @IsString()
  @Length(1, 100)
  code: string;

  @ApiPropertyOptional({ description: 'BOM name' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiProperty({ description: 'Parent material ID (finished good)' })
  @IsInt()
  @Min(1)
  parentMaterialId: number;

  @ApiProperty({ description: 'Version', example: '1.0' })
  @IsString()
  @Length(1, 20)
  version: string;

  @ApiPropertyOptional({ description: 'Effective date' })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Expiry date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({
    description: 'BOM lines/components',
    type: [CreateBomLineDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBomLineDto)
  lines: CreateBomLineDto[];
}
