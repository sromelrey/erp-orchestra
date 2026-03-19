# SYSTEM Module Overview

## Purpose
The SYSTEM module provides tenant-aware platform services that every other module relies on. It centralizes identity, access control, configuration, and cross-cutting orchestration so that domain modules can stay focused on their business logic while inheriting consistent governance and telemetry.

## Current Implementation Snapshot
| Capability | Status | Notes |
| --- | --- | --- |
| Tenant provisioning | ✅ Implemented | Multi-tenant schema separation with lifecycle hooks for seeding defaults. |
| Authentication / sessions | ✅ Implemented | Uses JWT + refresh tokens with session revocation logic. |
| RBAC (role-based access control) | ✅ Implemented | Hierarchical roles, permission namespaces, and policy guards wired into NestJS decorators. |
| Audit logging | ⚙️ In progress | Structured event trail defined; storage backend being finalized. |
| Feature flags / configuration | ⚙️ In progress | Config registry exposed; UI tooling pending. |

## Conceptual Responsibilities
1. **Tenant Management** – Create, suspend, and manage tenant metadata, including plan entitlements and data partitions.
2. **Identity & Security** – Maintain users, service accounts, and authentication flows, enforcing password and MFA policies.
3. **Access Control (RBAC/ABAC)** – Author role templates, assign permissions, and enforce guards at API and UI layers.
4. **Configuration Service** – Store environment-aware settings, feature toggles, and shared constants for downstream modules.
5. **Observability Hooks** – Emit standardized audit, metrics, and tracing events for the observability stack.

## RBAC Concept
- **Role library** – System ships with base roles (Admin, Operator, Auditor) that modules extend via scoped permissions.
- **Permission model** – Namespaces follow `module.feature.action` format (e.g., `operations.bom.view`).
- **Policy enforcement** – NestJS guards + decorators (`@RequireAccess`) validate permissions before controller execution.
- **Delegated administration** – Tenant admins can assign roles per user; system safeguards high-privilege actions with approval flows (coming soon).

## Feature Breakdown (Implemented Today)
| Feature Area | Delivered Capabilities | Interfaces / Notes |
| --- | --- | --- |
| Tenant Lifecycle | Create, suspend, and reactivate tenants; seed default roles and settings per tenant. | CLI + Admin API endpoints; hooks tie into provisioning scripts. |
| Identity & Sessions | Username/password login, refresh-token rotation, session revocation, MFA-ready schema. | `/auth` endpoints in NestJS; session store backed by Redis. |
| RBAC Core | Role + permission entities, hierarchical inheritance, decorator-based guard enforcement, policy evaluation service. | `@RequireAccess` + `RequireAccessGuard` used by every module controller. |
| Access Tooling | Admin UI to assign roles, view effective permissions, and audit access history (MVP). | React components consumed by portal + admin apps. |
| Configuration Service | Centralized key/value store scoped by tenant + environment, runtime client for module consumption. | Exposed through `/system/config` API; typed client available to services. |
| Observability Hooks | Structured audit event schema, log emitters, and tracing spans for critical flows. | Writes to audit topic; storage adapter finishing per roadmap. |

## Integration Points
| Consumer Module | Dependency | Rationale |
| --- | --- | --- |
| HRIS | Authentication, RBAC | Secure employee data and limit HR features by role. |
| OPERATIONS | Tenant context, RBAC | Ensure BOM, inventory, and production APIs inherit tenant + permission checks. |
| FINANCE | Audit logging | Financial transactions rely on immutable audit events. |

## Roadmap Highlights
- Finish audit log storage adapter (targeting Q2).
- Expose configuration UI for tenant admins to toggle beta features.
- Implement automated compliance reports (user access review exports).

---
For architecture diagrams, API references, and the detailed feature ↔ epic map, see:
- `/docs/backend/system/`
- [SYSTEM Feature Map](./FEATURES.md)
