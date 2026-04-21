import { PartialType } from '@nestjs/swagger';
import { CreateServiceConditionDto } from './create-service-condition.dto';

export class UpdateServiceConditionDto extends PartialType(
  CreateServiceConditionDto,
) {}
