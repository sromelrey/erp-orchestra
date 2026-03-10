import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompensationController } from './compensation.controller';
import { DeductionsController } from './deductions.controller';
import { CompensationService } from './compensation.service';
import {
  EmployeeCompensation,
  EmployeeDeduction,
  CompensationHistory,
} from '@/entities';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeCompensation,
      EmployeeDeduction,
      CompensationHistory,
    ]),
    PermissionModule,
  ],
  controllers: [CompensationController, DeductionsController],
  providers: [CompensationService],
  exports: [CompensationService],
})
export class CompensationModule {}
