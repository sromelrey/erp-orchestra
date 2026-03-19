# OPERATIONS Module Overview

## Purpose
The Operations module provides foundational supply chain and production data: item master, warehouses/locations, stock movements, bills of materials, and costing/availability services. It supports manufacturing, inventory, and procurement flows while enforcing tenant and RBAC controls.

## Current Picture
| Capability | Status | Notes |
| --- | --- | --- |
| Item Master (Items/Categories/UOM) | ✅ Delivered | CRUD + search with tenant and SKU/code indexing. |
| Warehouse & Locations | ✅ Delivered | Warehouses, bins/locations, opening balances. |
| Stock Ledger & Balances | ✅ Delivered | Receipts, issues, transfers, adjustments; balance snapshots. |
| BOM Entities & Validation | ✅ Delivered | BOM structure, cycle detection, UOM validation, versioning model. |
| BOM APIs (CRUD/Versioning) | 🚧 In Progress | CRUD + activation shipped; costing & breakdown pending integration. |
| Costing & Availability | 🚧 In Progress | Weighted-average initial design; FIFO follow-up planned; availability endpoints WIP. |
| Documentation & Admin UX | 🚧 In Progress | OpenAPI examples done; admin UI polish/import templates pending. |
| Advanced Cost Roll-up & MRP | 📋 Planned | To follow once costing + availability stabilize. |
| Sales Orders & Fulfillment | 📋 Planned | Order capture, reservation/allocation, pick/pack/ship, invoicing handoff. |
| Procurement & Goods Receipt | 📋 Planned | PR → PO workflow, vendor master, receiving with cost/lot/serial capture. |
| Goods Issue & Returns | 📋 Planned | Outbound issues for sales/production/returns with RBAC and audit. |
| Availability & Reservations | 📋 Planned | Allocations, safety stock rules, real-time availability APIs. |
| Lot/Serial Tracking | 📋 Planned | Traceability through receipts, movements, and returns. |
| Cycle Counts & Physical Inventory | 📋 Planned | Counting programs, recounts, and postings to the ledger. |
| Quality & Inspection | 📋 Planned | Receiving inspection, NCRs, hold/release flows. |
| Pricing & Catalog Hooks | 📋 Planned | Pricing tiers/agreements to support sales flows. |
| Event Broadcast & Webhooks | 📋 Planned | Ops domain events (receipts/issues/BOM changes) emitted to central notifications/webhook service. |

## References
- [Feature ↔ Epic Map](./FEATURES.md)
- [EPIC-06 Operations Master Data](../../epics/EPIC-06-Operations-Master-Data.md)
- [Project Roadmap](../../PROJECT-ROADMAP.md)
