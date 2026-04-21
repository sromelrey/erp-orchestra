import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateServiceTypeDto {
  @ApiProperty({
    description: 'Service type code',
    example: 'SILK_SCREEN',
    maxLength: 64,
  })
  @IsString()
  @MaxLength(64)
  code: string;

  @ApiProperty({
    description: 'Service type name',
    example: 'Silk Screen Printing',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Service type description',
    example: 'Traditional silk screen printing method',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the service type is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
