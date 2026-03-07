import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO for creating a new department.
 */
export class CreateDepartmentDto {
  @ApiProperty({
    example: 'ENG',
    description: 'Unique code for the department',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    example: 'Engineering',
    description: 'Display name of the department',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'Responsible for all software development activities',
    description: 'Description of the department',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
