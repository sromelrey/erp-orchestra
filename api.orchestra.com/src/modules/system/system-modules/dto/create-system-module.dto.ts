import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, Matches } from 'class-validator';

export class CreateSystemModuleDto {
  @ApiProperty({
    example: 'Human Resources',
    description: 'The name of the module',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'HRIS',
    description: 'Unique code for the module (UPPERCASE_UNDERSCORE)',
  })
  @IsString()
  @Matches(/^[A-Z_]+$/, {
    message: 'Code must be uppercase and underscores only',
  })
  code: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the module is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
