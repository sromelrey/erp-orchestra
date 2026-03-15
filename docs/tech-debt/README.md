# Tech Debt Backlog

## Table of Contents

| Item | Module/Area | Where to Apply | Description |
| --- | --- | --- | --- |
| [Bulk Import/Export APIs – Implementation Plan](./bulk-import-export-implementation-plan.md) | <span style="color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;">API (HRIS)</span> | Backend queues, FilesService, imports/exports endpoints | Finish BullMQ workers, presigned URLs, and job processing to make bulk import/export functional. |
| [HRIS Settings Frontend](./hris-settings-frontend.md) | <span style="color:#fff;background:#16a34a;padding:2px 6px;border-radius:6px;">Portal (HRIS)</span> | Frontend settings page (`/settings/hris`) | Add HRIS settings UI for compensation brackets and statutory deductions (SSS/PhilHealth/Pag-IBIG, etc.). |
| [HRIS Remaining Backend (EPIC-05)](./hris-remaining-backend.md) | <span style="color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;">API (HRIS)</span> | Reporting, import/export execution, notifications/webhooks, audit trail, API v2/docs | Deferred HRIS backend scope: reports, workers/files, notifications/webhooks, audit trail, API v2 + OpenAPI. |
| Reporting & Analytics (HRIS) | <span style="color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;">API (HRIS)</span> | Materialized views, `/reports/{reportKey}` CSV/JSON, seed `hris.report.view`, docs | Pending while HRIS is parked; needed for insights/compliance exports. |
| Notifications & Webhooks (HRIS) | <span style="color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;">API (HRIS)</span> | Templates/subscriptions, HR event emits, email/in-app/webhook dispatch | Pending; enables user/event alerts and integrations. |
| Audit Trail (HRIS) | <span style="color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;">API (HRIS)</span> | Before/after capture, `/audit-log` filters, restore with `hris.audit.restore` | Pending; needed for traceability and recovery. |
| API v2 & Docs (HRIS) | <span style="color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;">API (HRIS)</span> | `/api/v2/hris` prefix, harmonized DTOs/errors/pagination, OpenAPI 3.1 | Pending; needed for consistency and client upgrade path. |

## Overview
This directory tracks known technical debt and planned remediation work. Each item documents the gap, impact, and a concrete plan to resolve it.
