import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant, Plan } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Plan])],
  controllers: [TenantsController],
  providers: [TenantsService],
})
/**
 * Module for managing Tenants.
 * Exports services required for tenant management and registration.
 */
export class TenantsModule {}
