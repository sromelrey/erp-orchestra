import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateServiceConditionDto {
  @ApiProperty({
    description: 'Service condition code',
    example: 'LABEL_SOURCE',
    maxLength: 64,
  })
  @IsString()
  @MaxLength(64)
  code: string;

  @ApiProperty({
    description: 'Service condition name',
    example: 'Label Source',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Possible values for this condition',
    example: ['CUSTOMER', 'COMPANY'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  values: string[];

  @ApiProperty({
    description: 'Whether the service condition is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
