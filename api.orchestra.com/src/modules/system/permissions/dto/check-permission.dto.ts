import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for checking if the current user has a specific permission.
 */
export class CheckPermissionDto {
  @ApiProperty({
    example: 'hris.employee.view',
    description: 'The permission slug to check',
  })
  @IsString()
  @IsNotEmpty()
  permission: string;
}
