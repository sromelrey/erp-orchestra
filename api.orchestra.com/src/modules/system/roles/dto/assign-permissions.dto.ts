import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

/**
 * DTO for assigning or removing permissions from a role.
 */
export class AssignPermissionsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of permission IDs to assign to the role',
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  permissionIds: number[];
}
