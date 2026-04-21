import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateServiceOptionDto {
  @ApiProperty({
    description: 'Service option code',
    example: 'PRINT_ONLY',
    maxLength: 64,
  })
  @IsString()
  @MaxLength(64)
  code: string;

  @ApiProperty({
    description: 'Service option name',
    example: 'Print Only',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Service option description',
    example: 'Printing service only',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the service option is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
