# HRIS Remaining Backend (EPIC-05)

Deferred scope from EPIC-05 while core HRIS features operate. These items add reporting, job execution, notifications, auditability, and API v2 hardening.

## Gaps
- Reporting & analytics: no materialized views or `/reports/{reportKey}` endpoints; `hris.report.view` permission not seeded for reporting use.
- Bulk import/export execution: queue workers + FilesService missing; jobs remain pending without processing.
- Notifications & webhooks: templates/subscriptions and event dispatch not implemented.
- Audit trail: before/after capture and `/audit-log` querying not implemented.
- API v2 & docs: no `/api/v2/hris` routing or harmonized DTO/error contracts; OpenAPI 3.1 not published.

## Impact
- Missing reporting blocks insights and compliance exports.
- Import/export jobs cannot run, leading to user confusion and manual work.
- No notifications/webhooks reduces UX and integration readiness.
- No audit trail limits traceability and recovery (restore).
- API v2/docs gap risks inconsistency and slower client adoption.

## Suggested Remediation (high level)
1) Reporting & Analytics
   - Define materialized views; add `/reports/{reportKey}` CSV/JSON endpoints; seed `hris.report.view`; document payloads.
2) Bulk Import/Export Execution
   - Implement BullMQ workers, FilesService for presigned URLs, wire controllers to queues; add progress/error reporting.
3) Notifications & Webhooks
   - Add `NotificationTemplate`/`WebhookSubscription` entities, emit HR events (leave/timesheet/payroll), dispatch email/in-app/webhook; admin subscription endpoints.
4) Audit Trail
   - Middleware for before/after snapshots; `/audit-log` filters; restore with `hris.audit.restore` permission.
5) API v2 & Documentation
   - Introduce `/api/v2/hris` prefix; harmonize DTOs/pagination/errors; generate OpenAPI 3.1 and publish; migration guide.

## Definition of Done
- Reporting endpoints deliver CSV/JSON from defined report keys with RBAC enforced.
- Import/export jobs run end-to-end via workers with presigned uploads/downloads and accurate status/progress.
- Notifications/webhooks deliver events per configured subscriptions; admin UI can manage templates/subscriptions.
- Audit trail captures before/after and supports filtered queries and restore.
- API v2 available with documented contracts and upgrade guide.
