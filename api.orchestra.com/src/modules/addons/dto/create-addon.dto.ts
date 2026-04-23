import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  ValidateIf,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { RuleType } from '@/entities/addons/addon-inclusion-rule.entity';

export enum AddonType {
  PHYSICAL = 'PHYSICAL',
  SERVICE = 'SERVICE',
}

export class CreateAddonRuleDto {
  @ApiPropertyOptional({ description: 'Rule ID (for updates)' })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    description: 'Type of rule',
    enum: RuleType,
  })
  @IsEnum(RuleType)
  ruleType: RuleType;

  @ApiProperty({ description: 'Threshold value for the rule' })
  @IsNumber()
  thresholdValue: number;

  @ApiProperty({ description: 'Discount percentage' })
  @IsNumber()
  discountPercent: number;

  @ApiPropertyOptional({
    description: 'Whether the rule is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value as boolean;
  })
  isActive?: boolean = true;
}

export class CreateAddonDto {
  @ApiPropertyOptional({
    description: 'Unique code for the add-on (auto-generated if not provided)',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  code?: string;

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

  @ApiPropertyOptional({
    description: 'Addon inclusion rules',
    type: [CreateAddonRuleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddonRuleDto)
  rules?: CreateAddonRuleDto[];
}
