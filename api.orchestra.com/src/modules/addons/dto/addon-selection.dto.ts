import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddonSelectionDto {
  @ApiProperty({ description: 'ID of the add-on' })
  @IsNumber()
  addonId: number;

  @ApiPropertyOptional({
    description: 'Quantity of the add-on',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number = 1;

  @ApiPropertyOptional({ description: 'Notes for the add-on' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CalculateAddonPriceDto {
  @ApiProperty({
    description: 'Array of add-on selections',
    type: [AddonSelectionDto],
  })
  @IsArray()
  addons: AddonSelectionDto[];

  @ApiProperty({ description: 'Base quantity for inclusion rules' })
  @IsNumber()
  quantity: number;
}
