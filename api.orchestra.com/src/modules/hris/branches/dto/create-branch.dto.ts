import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO for creating a new branch.
 */
export class CreateBranchDto {
  @ApiProperty({
    example: 'MAIN',
    description: 'Unique code for the branch',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    example: 'Main Office',
    description: 'Display name of the branch',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: '123 Main Street, Metro Manila',
    description: 'Physical address of the branch',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '+63 2 8888 1234',
    description: 'Contact number for the branch',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactNumber?: string;

  @ApiPropertyOptional({
    example: 'Active',
    description: 'Status of the branch (Active, Inactive)',
    default: 'Active',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
