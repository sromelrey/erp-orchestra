import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAddonDto, CreateAddonRuleDto } from './create-addon.dto';
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateAddonRuleDto extends PartialType(CreateAddonRuleDto) {
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

export class UpdateAddonDto extends PartialType(
  OmitType(CreateAddonDto, ['rules'] as const),
) {
  @ApiPropertyOptional({
    description: 'Addon inclusion rules',
    type: [UpdateAddonRuleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddonRuleDto)
  rules?: UpdateAddonRuleDto[];
}
