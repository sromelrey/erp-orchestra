# 🧩 MRP Refocus Plan

### Core Modules

### 1. Item Master ✅ **COMPLETED** (100%)
- [x] **Raw Materials** - Components purchased from suppliers
- [x] **Finished Goods** - Products manufactured and sold
- [x] **Item Categories** - Classify items as RM or FG
- [x] **UOM Management** - Units of measure per item

### 2. Inventory Management ✅ **COMPLETED** (100%)
- [x] **Stock per Warehouse** - Current inventory levels
- [x] **Stock Movement Tracking** - All in/out transactions
- [x] **Stock Valuation** - Value of inventory
- [x] **Stock Adjustments** - Manual adjustments and write-offs
- [x] **Stock Transfers** - Between warehouses (create, update, approve, ship, receive)

### 3. Goods Receipt (Stock In) 📋 **PLANNED** (0%)
- [ ] **Purchase Order Receipt** - Receive raw materials
- [ ] **Production Receipt** - Receive finished goods from production
- [ ] **Return Processing** - Handle returned items
- [ ] **Quality Control** - Inspection and quarantine

### 4. Goods Issuance (Stock Out) ✅ **COMPLETED** (100%)
- [x] **Issuance Types** - Production, Sales, Transfer, Adjustment
- [x] **Warehouse Selection** - Source warehouse and location
- [x] **Item Allocation** - Track issued items and quantities
- [x] **Approval Workflow** - Multi-level approval process
- [x] **Batch/Expiry Tracking** - For traceability
- [x] **Transaction History** - Complete audit trail

### 5. Sales Orders 📋 **PLANNED** (0%)
- [ ] **Order Creation** - Customer orders
- [ ] **Stock Allocation** - Reserve inventory
- [ ] **Order Fulfillment** - Pick, pack, ship

### 6. Bill of Materials (BOM) ✅ **COMPLETED** (100%)
- [x] **BOM Definition** - Raw materials needed per finished good
- [x] **BOM Versions** - Track changes over time
- [x] **Cost Rollup** - Calculate production cost
- [x] **BOM Status Management** - Draft, Active, Inactive statuses
- [x] **Cost Calculation** - Automatic costing with breakdown
- [x] **Where-Used Analysis** - Find where components are used
- [x] **Cost History** - Track cost changes over time

### 7. Production / Batch Processing 📋 **PLANNED** (0%)
- [ ] **Production Orders** - Create manufacturing batches
- [ ] **Work Order Management** - Track production progress
- [ ] **Material Consumption** - Auto-deduct from inventory

## Additional Modules Implemented

### 8. User Management & Permissions ✅ **COMPLETED** (100%)
- [x] **Role-Based Access Control (RBAC)** - Complete permission system
- [x] **User Roles** - Admin, Manager, Operator roles
- [x] **Module Permissions** - Granular access control
- [x] **Tenant Support** - Multi-tenant architecture

### 9. Core Infrastructure ✅ **COMPLETED** (100%)
- [x] **Database Schema** - PostgreSQL with TypeORM
- [x] **API Framework** - NestJS with REST endpoints
- [x] **Authentication** - Session-based auth
- [x] **Validation** - DTO-based request validation
- [x] **Error Handling** - Centralized error management

## Implementation Status Summary

| Module | Backend API | Frontend UI | Overall | Status | Priority |
|--------|-------------|-------------|---------|---------|----------|
| Item Master | ✅ 100% | 🚧 40% | 70% | In Progress | Medium |
| Inventory Management | ✅ 100% | 📋 0% | 50% | Backend Ready | High |
| Goods Issuance | ✅ 100% | 📋 0% | 50% | Backend Ready | High |
| Goods Receipt | 📋 0% | 📋 0% | 0% | Not Started | High |
| Sales Orders | 📋 0% | 📋 0% | 0% | Not Started | Medium |
| BOM | ✅ 100% | 📋 0% | 50% | Backend Ready | Medium |
| Production | 📋 0% | 📋 0% | 0% | Not Started | Low |
| User Management | ✅ 100% | ✅ 90% | 95% | Almost Complete | Critical |
| Infrastructure | ✅ 100% | 🚧 30% | 65% | In Progress | Critical |

### Legend
- ✅ Completed/High Progress (80-100%)
- 🚧 In Progress/Medium Progress (30-79%)
- 📋 Not Started/Low Progress (0-29%)

### Summary by Status
- **Almost Complete**: User Management (95%)
- **Backend Ready, UI Pending**: Goods Issuance (50%), BOM (50%), Inventory Management (50%)
- **In Progress**: Item Master (70%), Infrastructure (65%)
- **Not Started**: Goods Receipt (0%), Sales Orders (0%), Production (0%)

## Completion Summary

### Backend API (67% Complete)
- **Fully Completed**: 6 out of 9 modules (Item Master, Inventory Management, Goods Issuance, BOM, User Management, Infrastructure)
- **In Progress**: 0 modules
- **Not Started**: 3 modules (Goods Receipt, Sales Orders, Production)

### Frontend UI (15% Complete)
- **Fully Completed**: 0 modules
- **In Progress**: 3 modules (Item Master, User Management, Common Components)
- **Not Started**: 6 modules

### Overall Project (40% Complete)
- **Backend Heavy**: Most API endpoints are ready
- **UI Lagging**: Frontend development needs focus
- **Next Priority**: Build UI for completed backend modules

### Modules by Combined Status:
- 🟢 **Ready for Production**: User Management (95%)
- 🟡 **Backend Ready, UI Pending**: Goods Issuance (50%), BOM (50%), Inventory Management (50%)
- 🟠 **Partially Complete**: Item Master (70%), Infrastructure (65%)
- 🔴 **Not Started**: Goods Receipt (0%), Sales Orders (0%), Production (0%)

## Next Steps

1. **Priority 1**: Implement Goods Receipt module
2. **Priority 2**: Develop Sales Order management
3. **Priority 3**: Build Production module (BOM is already complete!)
4. **Priority 4**: Build UI for completed backend modules

## Technical Debt & Improvements

- [ ] Add automated tests for all modules
- [ ] Implement API rate limiting
- [ ] Add caching for frequently accessed data
- [ ] Improve error messages for better UX
- [ ] Add API documentation (Swagger)

### Known Issues & TODOs

- [ ] **Stock Ledger balance_after column**: Create migration to add `balance_after` column to `stock_ledger` table for running balance tracking. After migration, uncomment TODO sections in:
  - `src/entities/operations/stock-ledger.entity.ts` (lines 60-68)
  - `src/modules/inventory/stock-movement.service.ts` (lines 33-46, 55)
- [ ] **Stock Transfer findAll relations**: Currently all relations are removed from `findAll` method to avoid TypeORM metadata errors. Need to add them back one by one to identify which entity (Material, Warehouse, or WarehouseLocation) has the metadata issue.
  - File: `src/modules/inventory/inventory-transfer/inventory-transfer.service.ts` (line 129-131)
- [ ] **ESLint type checking**: Temporary ESLint disable comments in `inventory-adjustment.service.ts` due to strict type checking rules. Consider refactoring to satisfy linter without disable comments.
  - File: `src/modules/inventory/inventory-adjustment/inventory-adjustment.service.ts` (line 326-328)
│       └── create/page.tsx   # Create GR
├── sales/
│   ├── orders/
│   │   ├── page.tsx          # Order list
│   │   ├── [id]/page.tsx     # Order details
│   │   └── create/page.tsx   # Create order
│   └── invoices/
│       ├── page.tsx          # Invoice list
│       └── [id]/page.tsx     # Invoice details
├── production/
│   ├── bom/
│   │   ├── page.tsx          # BOM list
│   │   ├── [id]/page.tsx     # BOM details
│   │   └── create/page.tsx   # Create BOM
│   └── batches/
│       ├── page.tsx          # Production batches
│       ├── [id]/page.tsx     # Batch details
│       └── create/page.tsx   # Create batch
└── reports/
    ├── inventory/page.tsx    # Stock reports
    ├── sales/page.tsx        # Sales reports
    └── production/page.tsx   # Production reports
```

## Database Design (Core Only)

```sql
-- Core Tables
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_type VARCHAR(20) NOT NULL, -- 'RAW_MATERIAL' | 'FINISHED_GOOD'
    category_id INTEGER,
    base_uom_id INTEGER NOT NULL,
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    min_stock_level DECIMAL(10,2) DEFAULT 0,
    max_stock_level DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    quantity DECIMAL(15,6) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(15,6) NOT NULL DEFAULT 0,
    available_quantity DECIMAL(15,6) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_movement_date TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    UNIQUE(item_id, warehouse_id, tenant_id)
);

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL, -- 'IN' | 'OUT' | 'TRANSFER' | 'ADJUST'
    reference_type VARCHAR(50), -- 'GR' | 'SO' | 'PROD' | 'ADJ'
    reference_id INTEGER,
    quantity DECIMAL(15,6) NOT NULL,
    unit_cost DECIMAL(10,2),
    balance_after DECIMAL(15,6),
    notes TEXT,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'DRAFT', -- 'DRAFT' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED'
    total_amount DECIMAL(12,2),
    notes TEXT,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(12,2),
    delivered_quantity DECIMAL(15,6) DEFAULT 0,
    tenant_id INTEGER NOT NULL
);

CREATE TABLE bom (
    id SERIAL PRIMARY KEY,
    finished_good_id INTEGER NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,
    expiry_date DATE,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bom_items (
    id SERIAL PRIMARY KEY,
    bom_id INTEGER NOT NULL,
    raw_material_id INTEGER NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    waste_percent DECIMAL(5,2) DEFAULT 0,
    tenant_id INTEGER NOT NULL
);

CREATE TABLE production_batches (
    id SERIAL PRIMARY KEY,
    batch_no VARCHAR(50) UNIQUE NOT NULL,
    bom_id INTEGER NOT NULL,
    planned_quantity DECIMAL(15,6) NOT NULL,
    actual_quantity DECIMAL(15,6),
    status VARCHAR(20) DEFAULT 'PLANNED', -- 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    notes TEXT,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE production_consumption (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    planned_quantity DECIMAL(15,6) NOT NULL,
    actual_quantity DECIMAL(15,6),
    tenant_id INTEGER NOT NULL
);
```

## 🚀 Build Plan

### Phase 1: Core Transactions (Week 1-2)
1. **Item Type Separation**
   - Add item_type field to items
   - Update UI to show RM/FG distinction
   - Add filters by item type

2. **Goods Receipt UI**
   - Create GR form page
   - Link to purchase orders (optional)
   - Update stock on receipt
   - Generate stock movements

3. **Sales Orders UI**
   - Create SO form page
   - Add stock validation/check
   - Implement stock reservation
   - Order status workflow

### Phase 2: Production Foundation (Week 3-4)
1. **Bill of Materials UI**
   - BOM creation/editing
   - BOM versioning
   - Cost calculation
   - BOM approval workflow

2. **Production Module**
   - Production batch creation
   - Material consumption
   - Production completion
   - Waste tracking

### Phase 3: Financial Integration (Week 5-6)
1. **Sales Invoice Integration**
   - Auto-generate from SO
   - Payment tracking
   - Customer statements

2. **Basic Reports**
   - Stock status report
   - Sales summary report
   - Production efficiency report
   - Inventory valuation

### Phase 4: Optimization (Week 7-8)
1. **Dashboard**
   - Key metrics overview
   - Low stock alerts
   - Production queue

2. **Advanced Features**
   - Stock transfers
   - Batch tracking
   - Export functionality

## Implementation Notes

### Priority Rules
1. **Always update stock** - Every transaction must affect stock levels
2. **Create audit trail** - All stock movements must be logged
3. **Validate before save** - Check availability, constraints
4. **Keep it simple** - Avoid complex features until core works

### Technical Guidelines
- Use database transactions for stock updates
- Implement proper error handling
- Add validation at API and UI level
- Use TypeScript strictly
- Follow existing patterns in codebase

### Success Metrics
- End-to-end flow: RM receipt → Production → FG → Sales → Invoice
- Accurate stock tracking at all steps
- Reports match actual transactions
- System performs well with test data
