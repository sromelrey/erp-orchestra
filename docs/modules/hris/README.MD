# HRIS Module Overview

## Purpose
The HRIS module covers the entire employee lifecycle: organizational structure, employee master data, time & attendance, leave, compensation, and payroll. It builds on the SYSTEM module for identity/RBAC and feeds OPERATIONS and FINANCE with accurate workforce data.

## Current Picture
| Capability | Status | Notes |
| --- | --- | --- |
| Org Master Data | ✅ Delivered | Departments, designations, branches with portal CRUD. |
| Employee Profiles & Onboarding | ✅ Delivered | Employee entity, onboarding wizard, auto-provision user access. |
| Attendance & Leave | ✅ Delivered | Time clock, leave balances, approvals, employee self-service. |
| Timesheets & Approvals | ✅ Delivered | Automated generation, anomaly detection, manager workflow. |
| Compensation & Deductions | ✅ Delivered | Compensation tabs, standalone CRUD, history tracking. |
| Payroll & Payslips | ✅ Delivered | Payroll run service, HR dashboard, employee payslip portal. |
| Reporting / Import / Notifications | 🚧 In Progress | Covered by EPIC-05; see feature map for scope. |

## References
- [Feature ↔ Epic Map](./FEATURES.md)
- [EPIC-03 HRIS Core & Employee Management](../../epics/EPIC-03-HRIS-Implementation-Plan.md)
- [EPIC-04 HRIS Attendance, Leave & Payroll](../../epics/EPIC-04-HRIS-Payroll-Attendance.md)
- [EPIC-05 HRIS API Completion](../../epics/EPIC-05-HRIS-API-Completion.md)
