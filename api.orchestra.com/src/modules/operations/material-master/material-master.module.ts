import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from '@/entities/inventory/material.entity';
import { MaterialMasterService } from './material-master.service';
import { MaterialMasterController } from './material-master.controller';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material]), PermissionModule],
  controllers: [MaterialMasterController],
  providers: [MaterialMasterService],
})
export class MaterialMasterModule {}
