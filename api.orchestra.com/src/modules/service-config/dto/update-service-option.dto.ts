import { PartialType } from '@nestjs/swagger';
import { CreateServiceOptionDto } from './create-service-option.dto';

export class UpdateServiceOptionDto extends PartialType(
  CreateServiceOptionDto,
) {}
