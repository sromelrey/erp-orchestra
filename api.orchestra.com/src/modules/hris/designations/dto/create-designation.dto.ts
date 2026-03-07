import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
} from 'class-validator';

/**
 * DTO for creating a new designation.
 */
export class CreateDesignationDto {
  @ApiProperty({
    example: 'SDEV',
    description: 'Unique code for the designation',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    example: 'Senior Developer',
    description: 'Display name of the designation',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Hierarchy or pay-grade level',
  })
  @IsOptional()
  @IsInt()
  level?: number;

  @ApiPropertyOptional({
    example: 'Responsible for leading technical projects',
    description: 'Description of the designation',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
