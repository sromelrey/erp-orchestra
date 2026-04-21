import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ImportUomDto {
  @ApiProperty({ description: 'UOM Code', example: 'PCS' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  code: string;

  @ApiProperty({ description: 'UOM Name', example: 'Pieces' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Precision (decimal places)',
    example: 2,
    required: false,
  })
  @IsOptional()
  precision?: number;
}
