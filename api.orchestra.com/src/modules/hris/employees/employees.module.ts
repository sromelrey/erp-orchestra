import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from '@/entities';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), PermissionModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
