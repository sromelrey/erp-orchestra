import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

/**
 * DTO for assigning users to a role.
 */
export class AssignUsersDto {
  @ApiProperty({
    description: 'Array of user IDs to assign to the role',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  userIds: number[];
}
