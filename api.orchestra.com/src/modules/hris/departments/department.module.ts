import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Department } from '@/entities';
import { PermissionModule } from '../../system/permissions/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), PermissionModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
