import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RuleType {
  MIN_QTY = 'MIN_QTY',
}

export class CreateAddonRuleDto {
  @ApiProperty({ description: 'ID of the add-on' })
  @IsNumber()
  addonId: number;

  @ApiProperty({
    enum: RuleType,
    description: 'Type of rule',
    default: RuleType.MIN_QTY,
  })
  @IsEnum(RuleType)
  ruleType: RuleType = RuleType.MIN_QTY;

  @ApiProperty({ description: 'Threshold value for the rule' })
  @IsNumber()
  thresholdValue: number;

  @ApiPropertyOptional({
    description: 'Discount percentage (100 for free)',
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  discountPercent?: number = 100;

  @ApiPropertyOptional({
    description: 'Whether the rule is active',
    default: true,
  })
  @IsOptional()
  isActive?: boolean = true;
}
