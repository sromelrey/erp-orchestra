import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItemCategoryDto {
  @ApiProperty({ example: 'FAB', maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  code: string;

  @ApiProperty({ example: 'Fabric Rolls', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Raw material fabrics', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
