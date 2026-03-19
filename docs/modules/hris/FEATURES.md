# HRIS Module Feature ↔ Epic Map

This document connects HRIS capabilities to their governing epics so you can trace implementation status, requirements, and future scope.

## Feature Coverage Table
| Feature Area | Status | Epic / Doc | Notes |
| --- | --- | --- | --- |
| Organizational Master Data (Departments, Designations, Branches) | ✅ Delivered | [EPIC-03 HRIS Core & Employee Management](../../epics/EPIC-03-HRIS-Implementation-Plan.md) | Backend + frontend CRUD, tenant isolation, permission-guarded UIs. |
| Employee Master Profiles & Onboarding | ✅ Delivered | [EPIC-03 HRIS Core & Employee Management](../../epics/EPIC-03-HRIS-Implementation-Plan.md#%F0%9F%93%8C-phase-3-employee-master-data-backend) | Employee entity with hierarchy, onboarding wizard, user provisioning toggle. |
| Attendance & Leave Management | ✅ Delivered | [EPIC-04 HRIS Attendance, Leave & Payroll](../../epics/EPIC-04-HRIS-Payroll-Attendance.md#%F0%9F%93%8C-phase-1-attendance-leave-system) | Time clock, leave balances, approval flows, RBAC-protected endpoints. |
| Timesheet Aggregation & Approvals | ✅ Delivered | [EPIC-04 HRIS Attendance, Leave & Payroll](../../epics/EPIC-04-HRIS-Payroll-Attendance.md#%F0%9F%93%8C-phase-2-timesheet-aggregation-approvals) | Cron-based generation, anomaly detection, manager review UI, manual triggers. |
| Compensation & Deductions Management | ✅ Delivered | [EPIC-04 HRIS Attendance, Leave & Payroll](../../epics/EPIC-04-HRIS-Payroll-Attendance.md#%F0%9F%93%8C-phase-3-compensation-deductions-management) | Compensation tabs, standalone pages, history tracking, permission gating. |
| Payroll Run & Payslip Portal | ✅ Delivered | [EPIC-04 HRIS Attendance, Leave & Payroll](../../epics/EPIC-04-HRIS-Payroll-Attendance.md#%F0%9F%93%8C-phase-4-payroll-processing-layer) | Payroll engine, HR dashboard, employee payslip downloads, audit logging. |
| Reporting & Analytics APIs | 🚧 In Progress | [EPIC-05 HRIS API Completion](../../epics/EPIC-05-HRIS-API-Completion.md#%F0%9F%93%8C-phase-1-reporting-analytics-apis) | Materialized views + `/reports/{key}` endpoints underway. |
| Bulk Import/Export (Employees, Timesheets, Payslips) | 🚧 In Progress | [EPIC-05 HRIS API Completion](../../epics/EPIC-05-HRIS-API-Completion.md#%F0%9F%93%8C-phase-2-bulk-import-export-module) | Job entities + API scaffold done; BullMQ workers + presigned URLs pending. |
| Notifications & Webhooks for HR Events | 📋 Planned | [EPIC-05 HRIS API Completion](../../epics/EPIC-05-HRIS-API-Completion.md#%F0%9F%93%8C-phase-3-notifications-webhooks) | Domain events + dispatcher queued for next milestone. |
| Audit Log Queries & Restore | 📋 Planned | [EPIC-05 HRIS API Completion](../../epics/EPIC-05-HRIS-API-Completion.md#%F0%9F%93%8C-phase-4-audit-trail-queries) | API + RBAC scopes scheduled with V2 rollout. |
| HRIS API v2 & Docs | 📋 Planned | [EPIC-05 HRIS API Completion](../../epics/EPIC-05-HRIS-API-Completion.md#%F0%9F%93%8C-phase-5-api-version-2-documentation) | Versioned endpoints, OpenAPI 3.1, migration guides. |

## How to Use This File
- **Product / Delivery** – Spot what’s GA vs. in-flight and jump straight into the epic for scope.
- **Engineering** – Align feature enhancements with the authoritative requirements document.
- **QA / Compliance** – Map test plans and audits to the exact epic responsible for each capability.

For the full HRIS narrative and roadmap references, see `docs/modules/README.md` and the individual epic files under `docs/epics/`.
