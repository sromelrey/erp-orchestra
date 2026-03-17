import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBomLineDto } from './create-bom.dto';

export class UpdateBomDto {
  @ApiPropertyOptional({ description: 'BOM name' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({ description: 'Version', example: '1.0' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  version?: string;

  @ApiPropertyOptional({ description: 'Effective date' })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Expiry date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({
    description: 'Updated BOM lines/components',
    type: [CreateBomLineDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBomLineDto)
  lines?: CreateBomLineDto[];
}
