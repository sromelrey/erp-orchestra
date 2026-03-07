# ERD: HRIS & Employee Management

This diagram represents the database schema for the Human Resources Information System (HRIS) module.
It illustrates how organizational master data connects to the central `Employee` entity, up through time tracking, leaves, and payroll.

```dbml
title ERD HRIS (Enterprise Grade)

// We reference these from the 'system' schema to show the connection
tenants [icon: building, color: gray] {
  id integer [pk, increment]
  name varchar(150)
  note: "Tenant ID (from system schema)"
}

users [icon: user, color: blue] {
  id integer [pk, increment]
  company_id integer
  email varchar(255)
  password_hash varchar(255)
  display_name varchar(150)
  first_name varchar(100)
  last_name varchar(100)
  is_active boolean
  last_login_at timestamptz
  note: "System Identity (from system schema)"
}

// HRIS specific tables
branches [icon: map-pin, color: orange] {
  id integer [pk, increment]
  tenant_id integer [not null, note: "FK to tenants.id"]
  code varchar(50)
  name varchar(150) [not null, note: "e.g. 'Main Office', 'Downtown Hub'"]
  address text
  contact_number varchar(50)
  status varchar(20) [note: "Active, Inactive"]
  created_at timestamptz
}

departments [icon: briefcase, color: purple] {
  id integer [pk, increment]
  tenant_id integer [not null, note: "FK to tenants.id"]
  code varchar(50) [note: "e.g. 'ENG', 'FIN'"]
  name varchar(150) [not null, note: "e.g. 'Engineering', 'Finance'"]
  description text
  head_employee_id integer [note: "FK to employees.id - Department Head"]
  created_at timestamptz
}

designations [icon: award, color: purple] {
  id integer [pk, increment]
  tenant_id integer [not null, note: "FK to tenants.id"]
  code varchar(50) [note: "e.g. 'SDEV', 'AMGR'"]
  name varchar(150) [not null, note: "e.g. 'Senior Developer', 'Area Manager'"]
  level integer [note: "Hierarchy/Pay grade level"]
  description text
  created_at timestamptz
}

employees [icon: users, color: green] {
  id integer [pk, increment]
  tenant_id integer [not null, note: "FK to tenants.id"]
  user_id integer [unique, nullable, note: "1-to-1 link to system.users. Null if no portal access yet."]
  
  employee_code varchar(50) [unique, not null, note: "e.g. 'EMP-001'"]
  
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  email varchar(255) [unique, not null]
  phone varchar(50)
  
  // Organizational Links
  branch_id integer [not null, note: "FK to branches"]
  department_id integer [not null, note: "FK to departments"]
  designation_id integer [not null, note: "FK to designations"]
  manager_id integer [nullable, note: "Self-referencing FK to employees for reporting hierarchy"]
  
  employment_type varchar(50)
  
  hire_date date [not null]
  terminated_at date
  
  status varchar(20) [default: "'Active'", note: "Active, OnLeave, Terminated"]
  
  emergency_contact text
  
  created_at timestamptz
  updated_at timestamptz
}

employee_job_history [icon: clock, color: green] {
  id integer [pk, increment]
  employee_id integer
  branch_id integer
  department_id integer
  designation_id integer
  manager_id integer
  start_date date
  end_date date
  reason text
}

employee_documents [icon: file-text, color: green] {
  id integer [pk, increment]
  employee_id integer
  document_type varchar(50)
  file_url text
  uploaded_at timestamptz
}

time_events [icon: watch, color: red] {
  id integer [pk, increment]
  employee_id integer
  type varchar(50)
  source varchar(50)
  happened_at timestamptz
  device_id varchar(150)
  ip_address varchar(80)
  request_id varchar(100)
  meta_json text
}

pay_periods [icon: calendar, color: red] {
  id integer [pk, increment]
  tenant_id integer
  start_date date
  end_date date
  status varchar(20)
  closed_at timestamptz
  closed_by_user_id integer
}

timesheets [icon: file-text, color: red] {
  id integer [pk, increment]
  employee_id integer
  pay_period_id integer
  status varchar(20)
  generated_at timestamptz
  reviewed_at timestamptz
  reviewed_by_user_id integer
  approved_at timestamptz
  approved_by_user_id integer
}

timesheet_days [icon: calendar, color: red] {
  id integer [pk, increment]
  timesheet_id integer
  work_date date
  regular_minutes integer
  break_minutes integer
  overtime_minutes integer
}

timesheet_adjustments [icon: edit-2, color: red] {
  id integer [pk, increment]
  timesheet_day_id integer
  field varchar(50)
  mode varchar(50)
  delta_minutes integer
  override_minutes integer
  reason text
  created_by_user_id integer
}

timesheet_anomalies [icon: alert-triangle, color: red] {
  id integer [pk, increment]
  timesheet_day_id integer
  code varchar(50)
  severity varchar(20)
  message varchar(400)
}

employee_compensation [icon: dollar-sign, color: yellow] {
  id integer [pk, increment]
  employee_id integer
  type varchar(50)
  hourly_rate decimal
  daily_rate decimal
  monthly_salary decimal
  effective_from date
  effective_to date
}

deductions [icon: minus-circle, color: yellow] {
  id integer [pk, increment]
  employee_id integer
  type varchar(50)
  label varchar(255)
  calculation_type varchar(50)
  amount decimal
  effective_from date
  effective_until date
  is_active boolean
}

payslips [icon: file-text, color: yellow] {
  id integer [pk, increment]
  employee_id integer
  pay_period_id integer
  status varchar(20)
  total_regular_minutes integer
  total_overtime_minutes integer
  gross_pay decimal
  total_deductions decimal
  net_pay decimal
  currency varchar(10)
  generated_by_user_id integer
  generated_at timestamptz
}

payslip_items [icon: list, color: yellow] {
  id integer [pk, increment]
  payslip_id integer
  type varchar(50)
  code varchar(50)
  label varchar(150)
  amount decimal
  meta_json text
}

leave_types [icon: umbrela, color: blue] {
  id integer [pk, increment]
  tenant_id integer
  name varchar(100)
  days_per_year integer
  is_paid boolean
}

leave_requests [icon: calendar, color: blue] {
  id integer [pk, increment]
  employee_id integer
  leave_type_id integer
  start_date date
  end_date date
  status varchar(20)
  approved_by integer
  reason text
}

// Relationships 

// Tenant Scoping
users.company_id > tenants.id
branches.tenant_id > tenants.id
departments.tenant_id > tenants.id
designations.tenant_id > tenants.id
employees.tenant_id > tenants.id
pay_periods.tenant_id > tenants.id
leave_types.tenant_id > tenants.id

// System Identity Link (1-to-1)
employees.user_id - users.id 

// Organizational Links
employees.branch_id > branches.id
employees.department_id > departments.id
employees.designation_id > designations.id

// Hierarchical Links
employees.manager_id > employees.id [note: "Reporting Line"]
departments.head_employee_id > employees.id [note: "Department Head"]

employee_job_history.employee_id > employees.id

employee_documents.employee_id > employees.id

time_events.employee_id > employees.id

timesheets.employee_id > employees.id
timesheets.pay_period_id > pay_periods.id

timesheet_days.timesheet_id > timesheets.id

timesheet_adjustments.timesheet_day_id > timesheet_days.id
timesheet_anomalies.timesheet_day_id > timesheet_days.id

employee_compensation.employee_id > employees.id

deductions.employee_id > employees.id

payslips.employee_id > employees.id
payslips.pay_period_id > pay_periods.id

payslip_items.payslip_id > payslips.id

leave_requests.employee_id > employees.id
leave_requests.leave_type_id > leave_types.id
```
