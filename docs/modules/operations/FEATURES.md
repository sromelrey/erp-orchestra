# OPERATIONS Module Feature ↔ Epic Map

This document links Operations capabilities to their governing epics for traceability across inventory, warehouses, stock ledger, BOMs, and costing/availability.

## Feature Coverage Table
| Feature Area | Status | Epic / Doc | Notes |
| --- | --- | --- | --- |
| Item Master (Items, Categories, UOM, Conversions) | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-1-item-master-uom) | CRUD + search, indexed by tenant and SKU/code, permissions seeded. |
| Warehouse & Location Hierarchy | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-2-warehouses-stock-ledger) | Warehouses, bins/locations, opening balances; RBAC guards in place. |
| Stock Ledger & Balances | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-2-warehouses-stock-ledger) | Movements (receipts, issues, transfers, adjustments) + balance snapshots. |
| Bill of Materials (BOM) Entities & Validation | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-3-bom--recipes) | BOM entities, cycle detection, UOM validation, versioning model. |
| BOM APIs (CRUD, Versioning) | 🚧 In Progress | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-3-bom--recipes) | CRUD + activation shipped; costing & breakdown pending integration. |
| Costing & Availability | 🚧 In Progress | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-4-costing--availability) | Weighted-average initial design; FIFO follow-up planned; availability endpoints WIP. |
| Documentation & DX (OpenAPI, Admin UX) | 🚧 In Progress | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-5-documentation--dx) | OpenAPI examples done; admin UI polish/import templates pending. |
| Advanced Cost Roll-up & MRP | 📋 Planned | [PROJECT-ROADMAP](../../PROJECT-ROADMAP.md#%F0%9F%93%86-phase-3-operational-modules) | Future roll-up, MRP, procurement integration, availability performance views. |

## How to Use This File
- **Product / Delivery** – See what’s live vs. in-flight and jump to the governing epic.
- **Engineering** – Align feature work with epic requirements and remaining gaps.
- **QA / Compliance** – Map test plans to the exact epic that defines each capability.

For the full Operations narrative and roadmap, see `docs/modules/README.md` and the epic files under `docs/epics/`.
