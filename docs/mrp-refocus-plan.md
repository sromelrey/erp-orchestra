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

### 3. Goods Receipt (Stock In) ✅ **COMPLETED** (100%)
- [x] **Purchase Order Receipt** - Receive raw materials
- [x] **Production Receipt** - Receive finished goods from production
- [x] **Return Processing** - Handle returned items
- [x] **Quality Control** - Inspection and quarantine

### 4. Goods Issuance (Stock Out) ✅ **COMPLETED** (100%)
- [x] **Issuance Types** - Production, Sales, Transfer, Adjustment
- [x] **Warehouse Selection** - Source warehouse and location
- [x] **Item Allocation** - Track issued items and quantities
- [x] **Approval Workflow** - Multi-level approval process
- [x] **Batch/Expiry Tracking** - For traceability
- [x] **Transaction History** - Complete audit trail

### 5. Sales Orders ✅ **COMPLETED** (100% Backend, 0% Frontend)
- [x] **Order Creation** - Customer orders (with customer_name field for flexibility)
- [x] **Stock Allocation** - Reserve inventory on confirmation
- [x] **Order Fulfillment** - Confirm, Ship, Deliver workflow
- [x] **Partial Delivery Support** - Track delivered vs ordered quantities
- [x] **Order Status Workflow** - DRAFT → CONFIRMED → SHIPPED → DELIVERED (or CANCELLED)
- [x] **Stock Ledger Integration** - Automatic stock movements on confirm/deliver/cancel
- [x] **Warehouse & Location Selection** - Per-item warehouse and location specification
- [x] **Discount & Tax Support** - Line-level and order-level discounts and taxes
- [x] **Audit Trail** - Approval, shipping, and delivery tracking with user/timestamp

### 6. Bill of Materials (BOM) ✅ **COMPLETED** (100%)
- [x] **BOM Definition** - Raw materials needed per finished good
- [x] **BOM Versions** - Track changes over time
- [x] **Cost Rollup** - Calculate production cost
- [x] **BOM Status Management** - Draft, Active, Inactive statuses
- [x] **Cost Calculation** - Automatic costing with breakdown
- [x] **Where-Used Analysis** - Find where components are used
- [x] **Cost History** - Track cost changes over time

### 7. Production / Batch Processing ✅ **COMPLETED** (100% Backend, 0% Frontend)
- [x] **Production Orders** - Create manufacturing batches
- [x] **Work Order Management** - Track production progress
- [x] **Material Consumption** - Auto-deduct from inventory

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
| Item Master | ✅ 100% | ✅ 100% | 100% | Complete | Medium |
| Inventory Management | ✅ 100% | 📋 0% | 50% | Backend Ready | High |
| Goods Issuance | ✅ 100% | 📋 0% | 50% | Backend Ready | High |
| Goods Receipt | ✅ 100% | 📋 0% | 50% | Backend Ready | High |
| Sales Orders | ✅ 100% | 📋 0% | 50% | Backend Ready | Medium |
| BOM | ✅ 100% | 📋 0% | 50% | Backend Ready | Medium |
| Production | ✅ 100% | 📋 0% | 50% | Backend Ready | Low |
| Materials | ✅ 100% | ✅ 100% | 100% | Complete | High |
| User Management | ✅ 100% | ✅ 90% | 95% | Almost Complete | Critical |
| Infrastructure | ✅ 100% | 🚧 30% | 65% | In Progress | Critical |

### Legend
- ✅ Completed/High Progress (80-100%)
- 🚧 In Progress/Medium Progress (30-79%)
- 📋 Not Started/Low Progress (0-29%)

### Summary by Status
- **Complete**: Item Master (100%), Materials (100%)
- **Almost Complete**: User Management (95%)
- **Backend Ready, UI Pending**: Goods Receipt (50%), Goods Issuance (50%), BOM (50%), Inventory Management (50%), Sales Orders (50%), Production (50%)
- **In Progress**: Infrastructure (65%)

## Completion Summary

### Backend API (100% Complete)
- **Fully Completed**: 9 out of 9 modules (Item Master, Inventory Management, Goods Issuance, Goods Receipt, Sales Orders, BOM, Production, Materials, User Management, Infrastructure)
- **In Progress**: 0 modules
- **Not Started**: 0 modules

### Frontend UI (24% Complete)
- **Fully Completed**: 2 modules (Item Master, Materials)
- **In Progress**: 2 modules (User Management, Common Components)
- **Not Started**: 6 modules (Inventory Management, Goods Receipt, Goods Issuance, Sales Orders, BOM, Production)

### Overall Project (62% Complete)
- **Backend Complete**: All API endpoints are ready
- **UI In Progress**: Frontend development needs focus
- **Next Priority**: Build UI for completed backend modules

### Modules by Combined Status:
- 🟢 **Complete**: Item Master (100%), Materials (100%)
- 🟡 **Backend Ready, UI Pending**: Goods Receipt (50%), Goods Issuance (50%), BOM (50%), Inventory Management (50%), Sales Orders (50%), Production (50%)
- 🟠 **Partially Complete**: User Management (95%), Infrastructure (65%)

## Next Steps

1. **Priority 1**: Build UI for Production module (backend complete)
2. **Priority 2**: Build UI for completed backend modules (Sales Orders, Goods Receipt, Goods Issuance, BOM, Inventory Management)
3. **Priority 3**: Build UI for BOM module (backend complete)
4. **Priority 4**: Address Stock Ledger balance_after column TODO
5. **Priority 5**: Add automated tests for all modules

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
    customer_id INTEGER,
    customer_name VARCHAR(255) NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'DRAFT', -- 'DRAFT' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    total_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    final_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    shipped_at TIMESTAMP,
    shipped_by INTEGER,
    delivered_at TIMESTAMP,
    delivered_by INTEGER,
    created_by INTEGER,
    updated_by INTEGER,
    deleted_by INTEGER,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    unit_of_measure_id INTEGER NOT NULL,
    unit_of_measure_code VARCHAR(20) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    line_total DECIMAL(12,2) NOT NULL,
    delivered_quantity DECIMAL(15,6) DEFAULT 0,
    allocated_quantity DECIMAL(15,6) DEFAULT 0,
    warehouse_id INTEGER NOT NULL,
    warehouse_name VARCHAR(255) NOT NULL,
    location_id INTEGER NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by INTEGER,
    updated_by INTEGER,
    deleted_by INTEGER,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
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

## Sales Order API Endpoints

The Sales Order module provides the following REST API endpoints:

### Order Management
- `POST /v1/ops/sales-orders` - Create new sales order (DRAFT status)
- `GET /v1/ops/sales-orders` - List all sales orders with filters and pagination
- `GET /v1/ops/sales-orders/:id` - Get sales order details
- `PATCH /v1/ops/sales-orders/:id` - Update sales order (DRAFT only)
- `DELETE /v1/ops/sales-orders/:id` - Delete sales order (DRAFT only, soft delete)

### Order Workflow
- `POST /v1/ops/sales-orders/:id/confirm` - Confirm order and allocate stock
- `POST /v1/ops/sales-orders/:id/ship` - Ship order
- `POST /v1/ops/sales-orders/:id/deliver` - Deliver items (supports partial delivery)
- `POST /v1/ops/sales-orders/:id/cancel` - Cancel order (releases allocated stock)

### Query Parameters (for GET /v1/ops/sales-orders)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (DRAFT, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- `customerName` - Filter by customer name (partial match)
- `orderNo` - Filter by order number (partial match)
- `orderDateFrom` - Filter by order date range (start)
- `orderDateTo` - Filter by order date range (end)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (ASC or DESC, default: DESC)

### Key Features
- **Automatic Order Numbering**: Generates format `SO-{YYYY}-{sequence}`
- **Stock Ledger Integration**: Creates stock ledger entries on confirm/deliver/cancel
- **Partial Delivery**: Supports delivering items in multiple shipments
- **Denormalized Data**: Stores item, warehouse, and location names for performance
- **Discount & Tax**: Line-level and order-level discount and tax calculation
- **Audit Trail**: Tracks who approved, shipped, and delivered orders
- **Flexible Customer**: customer_id is nullable, customer_name is required

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

3. **Sales Orders UI** (Backend Complete)
   - Create SO form page with customer selection
   - Add stock validation/check during confirmation
   - Implement stock reservation on confirm
   - Order status workflow (DRAFT → CONFIRMED → SHIPPED → DELIVERED)
   - Partial delivery support
   - Warehouse and location selection per item
   - Discount and tax calculation

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
