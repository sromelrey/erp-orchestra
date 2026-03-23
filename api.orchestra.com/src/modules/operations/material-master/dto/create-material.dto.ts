import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';
import { MaterialType } from '@/types/enums';

export class CreateMaterialDto {
  @ApiProperty({
    example: 'RAW-001',
    description: 'Unique SKU for the material',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    example: 'Steel Sheet 2mm',
    description: 'Material name',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Cold rolled steel sheet, 2mm thickness',
    description: 'Detailed material description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: MaterialType,
    example: MaterialType.RAW,
    description: 'Type of material',
  })
  @IsOptional()
  @IsEnum(MaterialType)
  materialType?: MaterialType;

  @ApiPropertyOptional({
    example: 'METALS',
    description: 'Material group for categorization',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  materialGroup?: string;

  @ApiProperty({
    example: 'KG',
    description: 'Base unit of measure',
    maxLength: 10,
  })
  @IsString()
  @MaxLength(10)
  baseUom: string;

  @ApiPropertyOptional({
    example: 7.85,
    description: 'Net weight of the material',
    maximum: 99999999.9999,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  netWeight?: number;

  @ApiPropertyOptional({
    example: 'KG',
    description: 'Unit of measure for weight',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  weightUom?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the material is active',
    default: true,
  })
  @IsOptional()
  isActive?: boolean;
}
