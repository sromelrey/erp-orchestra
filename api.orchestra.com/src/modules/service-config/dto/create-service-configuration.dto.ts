import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceConfigurationDto {
  @ApiProperty({
    description: 'Service type ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  serviceTypeId: number;

  @ApiProperty({
    description: 'Service option ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  serviceOptionId: number;

  @ApiProperty({
    description: 'Condition key (optional)',
    example: 'LABEL_SOURCE',
    required: false,
    maxLength: 64,
  })
  @IsString()
  @IsOptional()
  @MaxLength(64)
  conditionKey?: string;

  @ApiProperty({
    description: 'Condition value (optional)',
    example: 'CUSTOMER',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  conditionValue?: string;

  @ApiProperty({
    description: 'BOM ID (optional)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bomId?: number;

  @ApiProperty({
    description: 'Price for this configuration',
    example: 10.0,
    default: 0.0,
  })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Whether the configuration is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
