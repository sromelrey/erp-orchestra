import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AddonType {
  PHYSICAL = 'PHYSICAL',
  SERVICE = 'SERVICE',
}

export class CreateAddonDto {
  @ApiProperty({ description: 'Unique code for the add-on' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Name of the add-on' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the add-on' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: AddonType,
    description: 'Type of add-on: PHYSICAL or SERVICE',
    default: AddonType.PHYSICAL,
  })
  @IsEnum(AddonType)
  type: AddonType = AddonType.PHYSICAL;

  @ApiProperty({ description: 'Base price of the add-on', default: 0 })
  @IsNumber()
  basePrice: number = 0;

  @ApiPropertyOptional({ description: 'Material ID for physical add-ons' })
  @IsOptional()
  @IsNumber()
  materialId?: number;

  @ApiProperty({ description: 'Whether the add-on is active', default: true })
  @IsBoolean()
  isActive: boolean = true;
}
