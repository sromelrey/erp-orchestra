import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignationController } from './designation.controller';
import { DesignationService } from './designation.service';
import { Designation } from '@/entities/hris/designation.entity';
import { PermissionModule } from '../../system/permissions/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Designation]), PermissionModule],
  controllers: [DesignationController],
  providers: [DesignationService],
  exports: [DesignationService],
})
export class DesignationModule {}
