import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

/**
 * DTO for removing permissions from a user.
 * Supports bulk removal of user-specific permission overrides.
 * Send empty array to clear all user permissions.
 */
export class RemoveUserPermissionsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description:
      'Array of permission IDs to remove from the user. Send an empty array to clear all permissions.',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true, message: 'Each permission ID must be a valid integer' })
  permissionIds: number[];
}
