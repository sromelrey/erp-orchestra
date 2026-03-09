import { Module } from '@nestjs/common';
import { PayrollModule } from './payroll/payroll.module';
import { BranchModule } from './branches/branch.module';
import { DepartmentModule } from './departments/department.module';
import { DesignationModule } from './designations/designation.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    PayrollModule,
    BranchModule,
    DepartmentModule,
    DesignationModule,
    EmployeesModule,
  ],
})
export class HrisModule {}
