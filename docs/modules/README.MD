# ERP Modules Reference

## ERP System Overview
The Orchestra ERP platform centralizes operational, financial, and workforce data into a single, modular system. Each domain is encapsulated as its own module, enabling teams to evolve capabilities independently while sharing consistent security, workflow, and reporting patterns.

## Core Modules
| Module Name | Description | Details |
| --- | --- | --- |
| **HRIS** | Manages the full employee lifecycle, including onboarding, attendance, payroll, and compliance artifacts. | [Module guide](./hris/README.md) |
| **SYSTEM** | Provides tenant provisioning, authentication, RBAC, and shared configuration services for every module. | [Module guide](./system/README.md) |
| **OPERATIONS** | Covers manufacturing, inventory, BOMs, and fulfillment workflows to keep supply chains synchronized. | [Module guide](./operations/README.md) |
| **FINANCE** | Handles GL integration, payables/receivables, and financial controls with audit-ready data flows. | Coming soon |
| **REPORTS** | Aggregates cross-module metrics, KPIs, and executive dashboards for real-time insight. | Coming soon |
| **CRM** | Tracks customer accounts, pipelines, and engagements with hand-offs into operations and finance. | Coming soon |

### Module Documentation
- [SYSTEM module breakdown](./system/README.md)
- [HRIS module breakdown](./hris/README.md)
- [OPERATIONS module breakdown](./operations/README.md)

### Roadmap Snapshot
- **Phase 1 – System Foundation**: RBAC, multi-tenant identity, and session security completed (see [EPIC-01-RBAC](../epics/EPIC-01-RBAC.md)).
- **Phase 2 – HR & Operations Core**: HRIS core, attendance, and payroll epics delivered; Operations master data underway (materials, warehouses, BOMs). Refer to [PROJECT-ROADMAP](../PROJECT-ROADMAP.md) for status callouts.
- **Upcoming Modules**: Inventory, procurement, finance, and analytics epics are queued with dependencies on Phase 2 deliverables.

## Key Features
- Role-based access control spanning every module
- Scalable, event-driven architecture for high-volume transactions
- Unified audit logging and compliance reporting
- Configurable workflows and approval chains
- Real-time reporting with export-ready datasets

## Getting Started
```bash
# Clone the repository
git clone https://github.com/your-org/erp-orchestra.git && cd erp-orchestra

# Install dependencies (server + client)
npm install

# Run the stack (example)
npm run dev
```

---
For additional module-specific details, see the individual documentation under `docs/modules/`.
