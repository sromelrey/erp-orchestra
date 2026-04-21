import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Addon,
  AddonInclusionRule,
  SalesOrderItemAddon,
} from '@/entities/addons';
import { AddonsService } from './services/addons.service';
import { AddonPricingService } from './services/addon-pricing.service';
import { AddonsController } from './controllers/addons.controller';
import { TenantsModule } from '@/modules/system/tenants/tenants.module';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Addon, AddonInclusionRule, SalesOrderItemAddon]),
    TenantsModule,
    PermissionModule,
  ],
  controllers: [AddonsController],
  providers: [AddonsService, AddonPricingService],
  exports: [AddonsService, AddonPricingService],
})
export class AddonsModule {}
