# 🧩 MRP Refocus Plan

## Core Modules

### 1. Item Master
- **Raw Materials** - Components purchased from suppliers
- **Finished Goods** - Products manufactured and sold
- **Item Categories** - Classify items as RM or FG
- **UOM Management** - Units of measure per item

### 2. Inventory Management
- **Stock per Warehouse** - Current inventory levels
- **Stock Movement Tracking** - All in/out transactions
- **Stock Valuation** - Value of inventory

### 3. Goods Receipt (Stock In)
- **Purchase Order Receipt** - Receive raw materials
- **Production Receipt** - Receive finished goods from production
- **Return Processing** - Handle returned items

### 4. Sales Orders (Stock Out)
- **Order Creation** - Customer orders
- **Stock Allocation** - Reserve inventory
- **Order Fulfillment** - Pick, pack, ship

### 5. Bill of Materials (BOM)
- **BOM Definition** - Raw materials needed per finished good
- **BOM Versions** - Track changes over time
- **Cost Rollup** - Calculate production cost

### 6. Production / Batch Processing
- **Production Orders** - Create manufacturing batches
- **Material Consumption** - Deduct raw materials
- **Production Completion** - Add finished goods

### 7. Sales Invoice
- **Invoice Generation** - From sales orders
- **Payment Tracking** - Cash flow management
- **Customer Accounts** - Accounts receivable

### 8. Basic Reports
- **Stock Reports** - Current levels, movements
- **Sales Reports** - Revenue, top items
- **Production Reports** - Batch efficiency, waste

## Existing vs Missing

| Module | Existing | Missing | Status |
|--------|----------|---------|---------|
| Item Master | ✅ Materials Management | Item type separation (RM/FG) | 🚧 Partial |
| Inventory | ✅ Warehouse & Stock Movement | Stock valuation | 🚧 Partial |
| Goods Receipt | ✅ Backend controller | UI implementation | 🚧 Partial |
| Sales Orders | ✅ Backend controller | UI, stock allocation | 🚧 Partial |
| Bill of Materials | ✅ Backend controller | UI, cost rollup | 🚧 Partial |
| Production | ❌ | Entire module | ❌ Missing |
| Sales Invoice | ✅ Finance module | Integration with sales | 🚧 Partial |
| Reports | ✅ Finance reporting | Stock & production reports | 🚧 Partial |

## Backend Structure (NestJS)

```
src/modules/
├── inventory/
│   ├── items/
│   │   ├── items.controller.ts
│   │   ├── items.service.ts
│   │   └── dto/
│   ├── stock/
│   │   ├── stock.controller.ts
│   │   ├── stock.service.ts
│   │   └── dto/
│   └── movements/
│       ├── movements.controller.ts
│       ├── movements.service.ts
│       └── dto/
├── transactions/
│   ├── goods-receipt/
│   │   ├── goods-receipt.controller.ts
│   │   ├── goods-receipt.service.ts
│   │   └── dto/
│   └── sales/
│       ├── sales-orders.controller.ts
│       ├── sales-orders.service.ts
│       ├── sales-invoices.controller.ts
│       └── dto/
├── production/
│   ├── bom/
│   │   ├── bom.controller.ts
│   │   ├── bom.service.ts
│   │   └── dto/
│   └── batches/
│       ├── production-batches.controller.ts
│       ├── production-batches.service.ts
│       └── dto/
└── reports/
    ├── inventory-reports.service.ts
    ├── sales-reports.service.ts
    └── production-reports.service.ts
```

## Frontend Structure (Next.js)

```
app/(main)/
├── inventory/
│   ├── items/
│   │   ├── page.tsx          # Item list
│   │   ├── [id]/page.tsx     # Item details
│   │   └── create/page.tsx   # Create item
│   ├── stock/
│   │   ├── page.tsx          # Stock status
│   │   └── movements/page.tsx # Movement history
│   └── goods-receipt/
│       ├── page.tsx          # GR list
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
