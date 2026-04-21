import { PartialType } from '@nestjs/swagger';
import { CreateServiceConfigurationDto } from './create-service-configuration.dto';

export class UpdateServiceConfigurationDto extends PartialType(
  CreateServiceConfigurationDto,
) {}
