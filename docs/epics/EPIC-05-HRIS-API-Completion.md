# EPIC-05: HRIS API Completion & Optimization

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-05 |
| **Epic Name** | HRIS API Completion & Optimization |
| **Status** | 🚧 In Progress |
| **Priority** | High |
| **Dependencies** | EPIC-01, EPIC-02, EPIC-03, EPIC-04 |

---

## 🎯 Purpose
Finalize and polish all outstanding HRIS APIs to deliver a fully self-contained, versioned and well-documented service layer. This epic focuses on closing functional gaps, enforcing consistency, hardening security, and boosting performance across the entire HRIS domain (Core, Attendance/Leave, Timesheet, Compensation, Payroll).

---

## 📊 Scope & High-Level Goals
- Complete **reporting & analytics** endpoints (attendance metrics, payroll registers, leave balances).
- Provide **bulk import/export** APIs for employee data, timesheets, and payslips (CSV, XLSX).
- Introduce **notification & webhook** endpoints for HR events (leave approval, payroll publish).
- Add **audit trail** querying endpoints across all HRIS entities.
- Standardize **OpenAPI 3.1** specs with complete example payloads and error schemas.
- Implement **V2 versioning** strategy with deprecation policy.
- Optimize heavy queries with indexes & caching (Redis, CQRS projection tables).

---

## 🏗️ Architecture Notes
- Leverage NestJS **API versioning** module (`@nestjs/apix`) behind `/api/v2/hris/*`.
- Introduce **ReportService** (CQRS read-side) backed by materialized Postgres views.
- Use **BullMQ** queues for long-running bulk import/export jobs.
- All notifications via **Domain Events** -> **NotificationDispatcher** (email, in-app) & optional **WebhookService**.
- Centralized **AuditLog** entity capturing `actor`, `action`, `timestamp`, `before`, `after` JSON.

---

## 📝 Stories & Implementation Plan

### 📌 PHASE 1: Reporting & Analytics APIs
| Story ID | STORY-HR-009 |
|----------|--------------|
| **Name** | HRIS Reporting Endpoints |
| **Type** | Backend |

**Tasks:**
- [ ] Design materialized views for key HR metrics (attendance summary, leave accruals, payroll cost center totals).
- [ ] Expose `/reports/{reportKey}` parameterized endpoints with CSV/JSON formats.
- [ ] Add RBAC scopes `hris.report.view` with fine-grained sub-scopes.
- [ ] Provide Swagger examples & Postman collection.

### 📌 PHASE 2: Bulk Import/Export Module
| Story ID | STORY-HR-010 |
|----------|--------------|
| **Name** | HRIS Data Import/Export |
| **Type** | Full Stack |

**Tasks:**
- [ ] Create `ImportJob` & `ExportJob` entities with status tracking.
- [ ] Build queue workers using BullMQ for parsing & generation.
- [ ] Implement `/imports` and `/exports` REST endpoints with presigned S3 upload/download.
- [ ] Develop React wizard UI components for HR admins.
- [ ] Add Excel template generation utility.

### 📌 PHASE 3: Notifications & Webhooks
| Story ID | STORY-HR-011 |
|----------|--------------|
| **Name** | HR Event Notifications & Webhooks |
| **Type** | Backend |

**Tasks:**
- [ ] Implement `NotificationTemplate` & `WebhookSubscription` entities.
- [ ] Emit domain events for leave approval, timesheet approval, payroll published.
- [ ] Dispatch email (SendGrid), in-app toast, and optional outbound webhook POST.
- [ ] Add subscription management UI for admins.

### 📌 PHASE 4: Audit Trail Queries
| Story ID | STORY-HR-012 |
|----------|--------------|
| **Name** | Audit Log API |
| **Type** | Backend |

**Tasks:**
- [ ] Expand middleware to record before/after snapshots.
- [ ] Create `/audit-log` endpoints with filtering (actor, entity, date range).
- [ ] Implement soft-delete restore operation with RBAC `hris.audit.restore`.

### 📌 PHASE 5: API Version 2 & Documentation
| Story ID | STORY-HR-013 |
|----------|--------------|
| **Name** | HRIS API v2 Roll-out |
| **Type** | Backend |

**Tasks:**
- [ ] Introduce URL prefix `/api/v2/hris` with fallback deprecations for v1.
- [ ] Harmonize response DTOs, error codes, pagination.
- [ ] Generate full **OpenAPI 3.1** docs and publish to SwaggerHub.
- [ ] Provide migration guides and upgrade checklist.

---

## 🔒 Security & RBAC Additions
- `hris.report.view`
- `hris.import.manage`
- `hris.export.manage`
- `hris.notification.manage`
- `hris.webhook.manage`
- `hris.audit.view`
- `hris.audit.restore`

---

## 📈 KPIs
- 100% coverage of previously missing HRIS features via REST endpoints
- ≤250 ms p95 latency for heavy report endpoints (cached)
- 0 unscoped endpoints (all protected by RBAC & tenant guards)
- Successful bulk import/export throughput ≥ 10k records/min

---

## ✅ Definition of Done
1. All stories above reach production ready and pass QA.
2. HRIS API V2 documented and published with no undocumented endpoints.
3. Monitoring dashboards (Grafana) show targets met for latency & error rates.
4. Migration guide communicated to frontend teams and stakeholders.
