import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Employee,
  EmployeeCompensation,
  EmployeeDeduction,
  PayPeriod,
  Payslip,
  PayslipItem,
  Timesheet,
} from '@/entities';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payslip,
      PayslipItem,
      PayPeriod,
      Timesheet,
      EmployeeCompensation,
      EmployeeDeduction,
      Employee,
    ]),
    PermissionModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
