import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [EmployeeModule, PayrollModule],
})
export class HrisModule {}
