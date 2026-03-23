import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { MaterialType } from '@/types/enums';

export class QueryMaterialDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    type: 'integer',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value as string))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    type: 'integer',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value as string))
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search by SKU or name',
    example: 'steel',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: MaterialType,
    description: 'Filter by material type',
    example: MaterialType.RAW,
  })
  @IsOptional()
  @IsEnum(MaterialType)
  materialType?: MaterialType;

  @ApiPropertyOptional({
    description: 'Filter by material group',
    example: 'METALS',
  })
  @IsOptional()
  @IsString()
  materialGroup?: string;

  @ApiPropertyOptional({ description: 'Filter active status', example: true })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;
}
