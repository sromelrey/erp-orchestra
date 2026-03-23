# OPERATIONS Module Feature ↔ Epic Map

This document links Operations capabilities to their governing epics for traceability across inventory, warehouses, stock ledger, BOMs, and costing/availability.

## Feature Coverage Table
| Feature Area | Status | Epic / Doc | Notes |
| --- | --- | --- | --- |
| Item Master (Items, Categories, UOM, Conversions) | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-1-item-master-uom) | CRUD + search, tenant-scoped indexes on SKU/code, RBAC slugs seeded; ready for integrations. |
| Warehouse & Location Hierarchy | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-2-warehouses-stock-ledger) | Warehouses with nested locations (path/depth), default flags, opening balances; guarded endpoints. |
| Stock Ledger & Balances | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-2-warehouses-stock-ledger) | Receipts/issues/transfers/adjustments, signed quantities, balance snapshots with unique scope index. |
| Bill of Materials (BOM) Entities & Validation | ✅ Delivered | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-3-bom--recipes) | Versioned BOMs, cycle detection, UOM validation, where-used, activation model. |
| BOM APIs (CRUD, Versioning) | 🚧 In Progress | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-3-bom--recipes) | CRUD + activation live; costing/breakdown endpoints under integration; RBAC slugs present. |
| Costing & Availability | 🚧 In Progress | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-4-costing--availability) | Standard costing API + history scaffold; availability endpoints planned; FIFO follow-up slated. |
| Documentation & DX (OpenAPI, Admin UX) | 🚧 In Progress | [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md#%F0%9F%93%8C-phase-5-documentation--dx) | OpenAPI examples done; admin UI polish/import templates pending. |
| Advanced Cost Roll-up & MRP | 📋 Planned | [PROJECT-ROADMAP](../../PROJECT-ROADMAP.md#%F0%9F%93%86-phase-3-operational-modules) | Future roll-up, MRP, procurement integration, availability performance views. |

## How to Use This File
- **Product / Delivery** – See what’s live vs. in-flight and jump to the governing epic.
- **Engineering** – Align feature work with epic requirements and remaining gaps.
- **QA / Compliance** – Map test plans to the exact epic that defines each capability.

For the full Operations narrative and roadmap, see `docs/modules/README.md` and the epic files under `docs/epics/`.

## Additional Feature Notes
- **Permissions & RBAC** – All endpoints are guarded with module/feature slugs (e.g., `operations.item.manage`, `operations.bom.cost`). Ensure roles map to the correct tenant.
- **Audit & Soft Deletes** – Core entities include audit columns and `deleted_at`; list endpoints filter out soft-deleted records by default.
- **Schema Resets** – `npm run db:reset -- operations` truncates the Operations schema and re-runs seeders (comment seeders to start empty).
- **Costing Paths** – Cost calculation persists history, returns latest via `/cost/latest`, and supports date filters on history.
- **Data Integrity** – BOMs enforce versioning and cycle detection; stock balances enforce unique scope `(tenant, warehouse, location?, item, uom)`.

### Master Data Details (what each piece is for)
- **Item Categories**: Logical grouping for items (e.g., fabrics, trims, finished goods) to simplify filtering, reporting, and pricing rules.
- **Units of Measure (UoM)**: Defines measurement units and precision for quantities; underpins conversions and stock math consistency.
- **Items**: Tenant-scoped products/materials with links to category and base UoM; foundation for BOMs, stock, costing, and procurement.

## Suggested Test Flow (quick)
1) Auth → create category, UoM, item
2) Create warehouse + locations
3) (Optional) Create BOM + components
4) Record stock movements; verify ledger & balances
5) Run BOM cost calculate/history; fetch latest cost
