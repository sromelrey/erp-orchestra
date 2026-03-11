import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';

/**
 * DTO for assigning permissions to a user.
 * Supports bulk assignment with GRANT/DENY types and optional expiration dates.
 */
export class AssignUserPermissionsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description:
      'Array of permission IDs to assign to the user. Must contain at least one permission ID.',
    type: [Number],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one permission ID must be provided' })
  @IsInt({ each: true, message: 'Each permission ID must be a valid integer' })
  @IsNotEmpty({ message: 'Permission IDs array cannot be empty' })
  permissionIds: number[];

  @ApiProperty({
    example: 'GRANT',
    description:
      'Type of permission assignment. GRANT adds permissions, DENY overrides role permissions.',
    enum: ['GRANT', 'DENY'],
    default: 'GRANT',
    required: false,
  })
  @IsOptional()
  @IsEnum(['GRANT', 'DENY'], {
    message: 'Permission type must be either GRANT or DENY',
  })
  type?: 'GRANT' | 'DENY' = 'GRANT';

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description:
      'Optional expiration date for temporary permissions. Must be a future date if provided.',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
