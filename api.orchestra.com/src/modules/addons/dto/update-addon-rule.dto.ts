import { PartialType } from '@nestjs/swagger';
import { CreateAddonRuleDto } from './create-addon-rule.dto';

export class UpdateAddonRuleDto extends PartialType(CreateAddonRuleDto) {}
