import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { PayrollModule } from './payroll/payroll.module';
import { BranchModule } from './branches/branch.module';
import { DepartmentModule } from './departments/department.module';
import { DesignationModule } from './designations/designation.module';

@Module({
  imports: [
    EmployeeModule,
    PayrollModule,
    BranchModule,
    DepartmentModule,
    DesignationModule,
  ],
})
export class HrisModule {}
