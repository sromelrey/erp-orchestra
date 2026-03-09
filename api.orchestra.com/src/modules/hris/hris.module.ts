import { Module } from '@nestjs/common';
import { PayrollModule } from './payroll/payroll.module';
import { BranchModule } from './branches/branch.module';
import { DepartmentModule } from './departments/department.module';
import { DesignationModule } from './designations/designation.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveTypesModule } from './leave-types/leave-types.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';

@Module({
  imports: [
    PayrollModule,
    BranchModule,
    DepartmentModule,
    DesignationModule,
    EmployeesModule,
    AttendanceModule,
    LeaveTypesModule,
    LeaveRequestsModule,
  ],
})
export class HrisModule {}
