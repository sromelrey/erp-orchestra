import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsInt,
} from 'class-validator';

/**
 * DTO for creating a new role.
 */
export class CreateRoleDto {
  @ApiProperty({
    example: 'HR Manager',
    description: 'Display name for the role',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'HR_MGR',
    description: 'Unique code identifier for the role',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    example: 'Manages HR department employees and leave requests',
    description: 'Optional description of the role',
    required: false,
  })
  @ApiProperty({
    example: 'Manages HR department employees and leave requests',
    description: 'Optional description of the role',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'List of permission IDs to assign to the role upon creation',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  permissionIds?: number[];
}
