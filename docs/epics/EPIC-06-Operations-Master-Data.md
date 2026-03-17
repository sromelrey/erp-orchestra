# EPIC-06: Operations Master Data

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-06 |
| **Epic Name** | Operations Master Data |
| **Status** | 🚧 In Progress |
| **Priority** | High |
| **Dependencies** | EPIC-01 (RBAC), EPIC-02/03 (HRIS core data for user roles), data platform | 

---

## 🎯 Purpose
Establish foundational master data for operations: items, units, categories, warehouses/locations, stock records, and bills of materials/recipes. Provide secure APIs and admin UI scaffolds to support inventory, production, and procurement.

---

## 📊 Implementation Progress (as of March 16, 2026)

### ✅ Completed
- **Item Master**: Full CRUD for Items, Categories, Units of Measure, and Item Units with conversions
- **Warehouse Management**: Full CRUD for Warehouses and hierarchical Locations/Bins
- **Stock Ledger**: Complete stock movement tracking (Receipts, Issues, Transfers, Adjustments)
- **Stock Balances**: Real-time balance snapshots with proper indexing
- **BOM Entities & Validation**: Data models plus cycle-detection/version checks now wired into services
- **RBAC Integration**: All operations permissions seeded and guards applied
- **Database Migrations**: All tables created with proper indexes and constraints
- **API Documentation**: OpenAPI/Swagger documentation with examples
- **Testing Guide**: Comprehensive manual testing walkthrough

### 🚧 In Progress
- **BOM APIs**: CRUD + versioning endpoints delivered; costing and cost-breakdown responses still placeholder and awaiting costing service hookup
- **Costing**: Weighted average (initial) service design pending before FIFO follow-up
- **Availability Queries**: Real-time stock availability with safety stock rules still under development

### 📋 Pending
- **Admin UI Polish**: Enhanced forms and bulk import templates
- **Advanced Features**: Materialized views for performance optimization
- **Cost Roll-up & Integrations**: Procurement consumption, BOM explosion, MRP, and true cost roll-up

---

## 📊 Scope & High-Level Goals
- Item master with categories, units of measure, variants/attributes.
- Warehouse/location hierarchy with bins; stock ledger and adjustments.
- Bill of Materials (BOM) / Recipes with versioning and costs.
- Inventory adjustments and initial balances.
- Costing support (FIFO/weighted average) and availability queries.
- RBAC-permissioned APIs and OpenAPI documentation.

---

## 🏗️ Architecture Notes
- NestJS modules per bounded context: Items, Warehouses, Stock Ledger, BOM.
- Use TypeORM migrations for master tables and indexes (item_code, sku, warehouse_id + item_id).
- Prefer CQRS read models for availability summaries; event hooks for stock movements.
- Integrate with RBAC (`operations.*` permissions).

---

## 📝 Stories & Implementation Plan

### 📌 PHASE 1: Item Master & UOM
| Story ID | STORY-OPS-001 |
|----------|---------------|
| **Name** | Item Master + Units |
| **Type** | Backend & Admin UI |
| **Suggested Branch** | `feature/ops-item-master-uom` |

**Tasks:**
- [x] Create entities: Item, ItemCategory, UnitOfMeasure, ItemUnit (conversion). (ItemAttribute/Value deferred)
- [x] CRUD APIs + list/search filters; indexes on item_code/sku + tenant.
- [x] Seed permissions: `operations.item.view`, `operations.item.manage`, `operations.category.manage`, `operations.uom.manage`.
- [x] Admin UI: tables + create/edit forms; basic RBAC guards.

### 📌 PHASE 2: Warehouses & Stock Ledger
| Story ID | STORY-OPS-002 |
|----------|---------------|
| **Name** | Warehouses, Bins, Stock Ledger |
| **Type** | Backend |
| **Suggested Branch** | `feature/ops-warehouses-stock-ledger` |

**Tasks:**
- [x] Entities: Warehouse, Location/Bin, StockLedger (movements), StockBalance (snapshot/read model).
- [x] APIs: create warehouses/bins; record movements (receipts, issues, transfers, adjustments).
- [x] Adjustments/import for opening balances.
- [x] Permissions: `operations.warehouse.manage`, `operations.stock.manage`, `operations.stock.view`.

### 📌 PHASE 3: BOM / Recipes
| Story ID | STORY-OPS-003 |
|----------|---------------|
| **Name** | Bill of Materials / Recipes |
| **Type** | Backend |
| **Suggested Branch** | `feature/ops-bom-recipes` |

**Tasks:**
- [x] Entities: BomHeader, BomLine, BomVersion; link to finished good item and components.
- [ ] APIs: CRUD BOMs, versioning, activate/deprecate _(CRUD + activation done; costing + cost breakdown pending)_.
- [x] Validation: detect cycles, enforce UOM conversions.
- [x] Permissions: `operations.bom.view`, `operations.bom.manage`.

### 📌 PHASE 4: Costing & Availability
| Story ID | STORY-OPS-004 |
|----------|---------------|
| **Name** | Costing & Availability |
| **Type** | Backend |
| **Suggested Branch** | `feature/ops-costing-availability` |

**Tasks:**
- [ ] Implement weighted average (initial) costing; plan for FIFO as follow-up.
- [ ] Availability endpoint per item/location with configurable safety stock.
- [x] Materialized view or cache for aggregated availability.

### 📌 PHASE 5: Documentation & DX
| Story ID | STORY-OPS-005 |
|----------|---------------|
| **Name** | OpenAPI + Admin UX polish |
| **Type** | Docs & UI |
| **Suggested Branch** | `chore/ops-openapi-admin-ux` |

**Tasks:**
- [x] OpenAPI examples for all endpoints; error codes and validation messages.
- [ ] Admin UI polish for Items/Warehouses/BOM forms; bulk import templates.
- [x] Postman/HTTP examples for stock movements and BOM CRUD.

---

## 🔒 Security & RBAC Additions
- `operations.item.view`, `operations.item.manage`
- `operations.category.manage`
- `operations.uom.manage`
- `operations.warehouse.manage`
- `operations.stock.view`, `operations.stock.manage`
- `operations.bom.view`, `operations.bom.manage`

---

## 📈 KPIs
- Item lookup p95 ≤ 200ms with filters.
- Stock availability freshness ≤ 5s behind latest movement (eventual consistency acceptable).
- Zero unscoped operations endpoints (all RBAC + tenant guards).

---

## ✅ Definition of Done
1. Master data (items, UOM, categories, warehouses) CRUD stable and RBAC-protected.
2. Stock ledger records movements; availability endpoints reflect balances.
3. BOMs can be created/versioned and linked to items without cycles.
4. OpenAPI docs and admin UI allow basic management without DB access.
