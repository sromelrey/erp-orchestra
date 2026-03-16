import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItemCategoryDto {
  @ApiProperty({ example: 'RAW', maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  code: string;

  @ApiProperty({ example: 'Raw Materials', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Unprocessed inputs', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
