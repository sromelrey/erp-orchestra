export const hris_seeder = [
  {
    module: 'hris',
    resource: 'employee',
    action: 'view',
    slug: 'hris.employee.view',
    name: 'View Employees',
  },
  {
    module: 'hris',
    resource: 'employee',
    action: 'create',
    slug: 'hris.employee.create',
    name: 'Create Employees',
  },
  {
    module: 'hris',
    resource: 'employee',
    action: 'update',
    slug: 'hris.employee.update',
    name: 'Update Employees',
  },
  {
    module: 'hris',
    resource: 'employee',
    action: 'delete',
    slug: 'hris.employee.delete',
    name: 'Delete Employees',
  },
  {
    module: 'hris',
    resource: 'employee',
    action: 'manage',
    slug: 'hris.employee.manage',
    name: 'Manage Employees',
  },
  // HRIS - Attendance
  {
    module: 'hris',
    resource: 'attendance',
    action: 'log',
    slug: 'hris.attendance.log',
    name: 'Log Attendance',
  },
  {
    module: 'hris',
    resource: 'attendance',
    action: 'view',
    slug: 'hris.attendance.view',
    name: 'View Attendance',
  },
  // HRIS - Leave
  {
    module: 'hris',
    resource: 'leave',
    action: 'request',
    slug: 'hris.leave.request',
    name: 'Request Leave',
  },
  {
    module: 'hris',
    resource: 'leave',
    action: 'manage',
    slug: 'hris.leave.manage',
    name: 'Manage Leaves',
  },
  // HRIS - Leave Type
  {
    module: 'hris',
    resource: 'leave_type',
    action: 'manage',
    slug: 'hris.leave_type.manage',
    name: 'Manage Leave Types',
  },
  // HRIS - Branch
  {
    module: 'hris',
    resource: 'branch',
    action: 'view',
    slug: 'hris.branch.view',
    name: 'View Branches',
  },
  {
    module: 'hris',
    resource: 'branch',
    action: 'manage',
    slug: 'hris.branch.manage',
    name: 'Manage Branches',
  },
  // HRIS - Department
  {
    module: 'hris',
    resource: 'department',
    action: 'view',
    slug: 'hris.department.view',
    name: 'View Departments',
  },
  {
    module: 'hris',
    resource: 'department',
    action: 'manage',
    slug: 'hris.department.manage',
    name: 'Manage Departments',
  },
  // HRIS - Designation
  {
    module: 'hris',
    resource: 'designation',
    action: 'view',
    slug: 'hris.designation.view',
    name: 'View Designations',
  },
  {
    module: 'hris',
    resource: 'designation',
    action: 'manage',
    slug: 'hris.designation.manage',
    name: 'Manage Designations',
  },
  // HRIS - Payroll (Pay Periods)
  {
    module: 'hris',
    resource: 'payroll',
    action: 'view',
    slug: 'hris.payroll.view',
    name: 'View Pay Periods',
  },
  {
    module: 'hris',
    resource: 'payroll',
    action: 'manage',
    slug: 'hris.payroll.manage',
    name: 'Manage Pay Periods',
  },
  // HRIS - Timesheet
  {
    module: 'hris',
    resource: 'timesheet',
    action: 'view',
    slug: 'hris.timesheet.view',
    name: 'View Timesheets',
  },
  {
    module: 'hris',
    resource: 'timesheet',
    action: 'manage',
    slug: 'hris.timesheet.manage',
    name: 'Manage Timesheets',
  },
  // HRIS - Imports/Exports
  {
    module: 'hris',
    resource: 'import',
    action: 'manage',
    slug: 'hris.import.manage',
    name: 'Manage HRIS Imports',
  },
  {
    module: 'hris',
    resource: 'export',
    action: 'manage',
    slug: 'hris.export.manage',
    name: 'Manage HRIS Exports',
  },
];
