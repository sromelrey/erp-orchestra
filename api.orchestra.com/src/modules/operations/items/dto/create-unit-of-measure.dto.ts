import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUnitOfMeasureDto {
  @ApiProperty({ example: 'KG', maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  code: string;

  @ApiProperty({ example: 'Kilogram', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 3, minimum: 0, maximum: 6, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  precision?: number;
}
