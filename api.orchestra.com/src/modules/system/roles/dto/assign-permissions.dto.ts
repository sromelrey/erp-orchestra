import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

/**
 * DTO for assigning or removing permissions from a role.
 */
export class AssignPermissionsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description:
      'Array of permission IDs to assign to the role. Send an empty array to clear all permissions.',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  permissionIds: number[];
}
