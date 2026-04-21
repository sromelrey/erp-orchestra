import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from '@/entities/service-config/service-type.entity';
import { ServiceOption } from '@/entities/service-config/service-option.entity';
import { ServiceCondition } from '@/entities/service-config/service-condition.entity';
import { ServiceConfiguration } from '@/entities/service-config/service-configuration.entity';
import { ServiceTypeService } from './services/service-type.service';
import { ServiceOptionService } from './services/service-option.service';
import { ServiceConditionService } from './services/service-condition.service';
import { ServiceConfigurationService } from './services/service-configuration.service';
import { ServiceConfigService } from './services/service-config.service';
import { ServiceTypeController } from './controllers/service-type.controller';
import { ServiceOptionController } from './controllers/service-option.controller';
import { ServiceConditionController } from './controllers/service-condition.controller';
import { ServiceConfigurationController } from './controllers/service-configuration.controller';
import { TenantsModule } from '../system/tenants/tenants.module';
import { PermissionModule } from '../system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceType,
      ServiceOption,
      ServiceCondition,
      ServiceConfiguration,
    ]),
    TenantsModule,
    PermissionModule,
  ],
  controllers: [
    ServiceTypeController,
    ServiceOptionController,
    ServiceConditionController,
    ServiceConfigurationController,
  ],
  providers: [
    ServiceTypeService,
    ServiceOptionService,
    ServiceConditionService,
    ServiceConfigurationService,
    ServiceConfigService,
  ],
  exports: [
    ServiceTypeService,
    ServiceOptionService,
    ServiceConditionService,
    ServiceConfigurationService,
    ServiceConfigService,
  ],
})
export class ServiceConfigModule {}
