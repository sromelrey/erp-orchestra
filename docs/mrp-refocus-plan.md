# 🧩 MRP Refocus Plan

### Core Modules

### 1. Item Master ✅ **COMPLETED** (100%)
- [x] **Raw Materials** - Components purchased from suppliers
- [x] **Finished Goods** - Products manufactured and sold
- [x] **Item Categories** - Classify items as RM or FG
- [x] **UOM Management** - Units of measure per item

### 2. Inventory Management ✅ **COMPLETED** (100% Backend, 100% Frontend, 100% Tested)
- [x] **Stock Ledger** - View stock movements and record new movements
- [x] **Stock per Warehouse** - Current inventory levels
- [x] **Stock Movement Tracking** - All in/out transactions
- [x] **Stock Valuation** - Value of inventory
- [x] **Stock Adjustments** - Manual adjustments and write-offs with DRAFT/APPROVE/CANCEL workflow
- [x] **Stock Transfers** - Between warehouses with PENDING/APPROVE/SHIP/RECEIVE/CANCEL workflow
- [x] **Goods Issuance** - Issue stock for production, sales, transfers, and adjustments
- [x] **Frontend UI** - Complete inventory management pages with workflow integration
- [x] **Workflow System** - Multi-step workflows with optimistic updates
- [x] **Form Management** - Create/edit forms with nested items arrays
- [x] **Permission System** - Granular permissions for all inventory operations

### 3. Goods Receipt (Stock In) ✅ **COMPLETED** (100% Backend, 100% Frontend)
- [x] **Purchase Order Receipt** - Receive raw materials
- [x] **Production Receipt** - Receive finished goods from production
- [x] **Return Processing** - Handle returned items
- [x] **Quality Control** - Inspection and quarantine
- [x] **Frontend UI** - Complete goods receipts page with workflow integration
- [x] **Workflow System** - Confirm/Cancel workflow with optimistic updates
- [x] **Form Management** - Create/edit goods receipt forms
- [x] **Stats Dashboard** - Goods receipt statistics and metrics
- [x] **Permission System** - Granular permissions for goods receipts operations

### 4. Goods Issuance (Stock Out) ✅ **COMPLETED** (100%)
- [x] **Issuance Types** - Production, Sales, Transfer, Adjustment
- [x] **Warehouse Selection** - Source warehouse and location
- [x] **Item Allocation** - Track issued items and quantities
- [x] **Approval Workflow** - Multi-level approval process
- [x] **Batch/Expiry Tracking** - For traceability
- [x] **Transaction History** - Complete audit trail

### 5. Sales Orders ✅ **COMPLETED** (100% Backend, 100% Frontend)
- [x] **Order Creation** - Customer orders (with customer_name field for flexibility)
- [x] **Stock Allocation** - Reserve inventory on confirmation
- [x] **Order Fulfillment** - Confirm, Ship, Deliver workflow
- [x] **Partial Delivery Support** - Track delivered vs ordered quantities
- [x] **Order Status Workflow** - DRAFT → CONFIRMED → SHIPPED → DELIVERED (or CANCELLED)
- [x] **Stock Ledger Integration** - Automatic stock movements on confirm/deliver/cancel
- [x] **Warehouse & Location Selection** - Per-item warehouse and location specification
- [x] **Discount & Tax Support** - Line-level and order-level discounts and taxes
- [x] **Audit Trail** - Approval, shipping, and delivery tracking with user/timestamp

#### 🆕 Design Upload & Job Order Preparation
- Allow uploading design images per Sales Order Item
- Only available when status = CONFIRMED
- Store image as file path (local storage)

##### Features
- Upload/replace design per item
- Preview design in Sales Order details
- Filter Sales Orders:
  - Status = CONFIRMED
  - With/without design
- Generate Job Order PDF from selected orders/items

##### Workflow
```text
DRAFT → CONFIRMED → (Upload Design) → Job Order → Production
```

##### Database Updates
Extend `sales_order_items`:
- design_image_path
- design_notes

##### API Additions
- Upload design endpoint
- Job order PDF generation endpoint

##### Notes
- Design is required before generating Job Order
- Does not affect inventory or BOM
- Acts as bridge between Sales and Production

### 6. Bill of Materials (BOM) ✅ **COMPLETED** (100%)
- [x] **BOM Definition** - Raw materials needed per finished good
- [x] **BOM Versions** - Track changes over time
- [x] **Cost Rollup** - Calculate production cost
- [x] **BOM Status Management** - Draft, Active, Inactive statuses
- [x] **Cost Calculation** - Automatic costing with breakdown
- [x] **Where-Used Analysis** - Find where components are used
- [x] **Cost History** - Track cost changes over time

### 7. Production / Batch Processing ✅ **COMPLETED** (100% Backend, 100% Frontend)
- [x] **Production Orders** - Create manufacturing batches
- [x] **Work Order Management** - Track production progress
- [x] **Material Consumption** - Auto-deduct from inventory
- [x] **Production UI** - Complete production batch management interface
- [x] **Workflow System** - Start, Complete, Cancel workflow with optimistic updates
- [x] **Form Management** - Create/edit production batch forms with BOM selection
- [x] **Stats Dashboard** - Production statistics and metrics
- [x] **Permission System** - Granular permissions for production operations
- [x] **Status-based Edit Control** - Non-editable for IN_PROGRESS, COMPLETED, CANCELLED
- [x] **Real-time Updates** - Form fields disable during processing

## Additional Modules Implemented

### 8. User Management & Permissions ✅ **COMPLETED** (100% Backend, 100% Frontend)
- [x] **Role-Based Access Control (RBAC)** - Complete permission system
- [x] **User Roles** - Admin, Manager, Operator roles
- [x] **Module Permissions** - Granular access control
- [x] **Tenant Support** - Multi-tenant architecture
- [x] **Permission Documentation** - Backend and frontend implementation guides
- [x] **Goods Receipt Permissions** - Specific permissions for goods receipts operations
- [x] **Permission Migrations** - Database migrations for permission updates

### 9. Core Infrastructure 🚧 **IN PROGRESS** (40% Desktop Deployment Ready)
- [x] **Database Schema** - PostgreSQL with TypeORM
- [x] **API Framework** - NestJS with REST endpoints
- [x] **Authentication** - Session-based auth
- [x] **Validation** - DTO-based request validation
- [x] **Error Handling** - Centralized error management
- [ ] **Desktop Installer** - Windows/Mac installer for local deployment
- [ ] **Local Database Setup** - Automated PostgreSQL installation/config
- [ ] **Service Management** - Windows Service / systemd daemon
- [ ] **Auto-Start Configuration** - Start services on boot
- [ ] **Local File Storage** - Desktop file system for imports/exports
- [ ] **Backup/Restore** - Local database backup automation
- [ ] **Update Mechanism** - Desktop app update system
- [ ] **Offline Mode Support** - Cached data for offline operation

### 10. Customer Management 📋 **NOT STARTED** (0% Backend, 0% Frontend) - **LOWEST PRIORITY**
- [ ] **Customer CRUD** - Create, view, update, delete customers
- [ ] **Customer Information** - Contact details, billing/shipping addresses
- [ ] **Customer Classification** - Customer types/categories
- [ ] **Credit Management** - Credit limits and payment terms
- [ ] **Customer History** - Order history and payment tracking
- [ ] **Integration** - Link to Sales Orders (replace customer_name field)

### 11. Service Configuration (Printing MRP) ✅ **COMPLETED** (100% Backend, 100% Frontend)
- Enables service-based order entry for printing operations (Silk Screen, Sublimation)
- Acts as a decision layer between Sales Orders and BOM
- Automatically assigns BOM and pricing based on service selection

#### Features
- [x] **Service Types** - Silk Screen, Sublimation
- [x] **Service Options** - Print Only, Print + Label, Fabric Print
- [x] **Service Configuration Mapping** - Service Type + Option + Condition → BOM + Price
- [x] **Label Source Handling** - CUSTOMER / COMPANY
- [x] **Automatic BOM Assignment** - No manual selection required

#### Integration Notes
- Extend `sales_order_items` with:
  - `service_type_id`
  - `service_option_id`
  - `label_source`
  - `bom_id` (auto-assigned)
- No changes required for:
  - BOM module
  - Production module
  - Inventory module

### 12. Add-ons & Inclusion Rules ✅ **COMPLETED** (100% Backend, 100% Frontend)
- Supports optional add-ons per sales order item:
  - Etekita
  - Inner Label
  - Hangtag
  - Size Label
  - Hem Tag
  - Patch Neck
  - Sleeve Tag

#### Features
- [x] **Add-on Selection** - Per Sales Order item
- [x] **Pricing per Add-on** - Individual add-on pricing
- [x] **Free Inclusion Rules** - Example: Free if quantity ≥ 40
- [x] **Conditional Inventory Deduction** - Deduct only if company provided, skip if customer provided

#### Notes
- Add-ons must NOT be part of Service Types
- Add-ons extend BOM dynamically (do not modify base BOM)
- This feature is implemented AFTER Service Configuration

## Implementation Status Summary

| Module | Backend API | Frontend UI | Overall | Status | Priority |
|--------|-------------|-------------|---------|---------|----------|
| Item Master | ✅ 100% | ✅ 100% | 100% | Complete | Medium |
| Inventory Management | ✅ 100% | ✅ 100% | 100% | Complete | High |
| Goods Issuance | ✅ 100% | ✅ 100% | 100% | Complete | High |
| Goods Receipt | ✅ 100% | ✅ 100% | 100% | Complete | High |
| Sales Orders | ✅ 100% | ✅ 100% | 100% | Complete | Medium |
| Design Upload & Job Order Preparation | 📋 0% | 📋 0% | 0% | Not Started | High |
| BOM | ✅ 100% | ✅ 100% | 100% | Complete | Medium |
| Production | ✅ 100% | ✅ 100% | 100% | Complete | Low |
| Materials | ✅ 100% | ✅ 100% | 100% | Complete | High |
| User Management | ✅ 100% | ✅ 100% | 100% | Complete | Critical |
| Infrastructure | ✅ 100% | 🚧 40% | 70% | In Progress | Critical |
| Service Configuration | ✅ 100% | ✅ 100% | 100% | Complete | High |
| Add-ons & Inclusion Rules | ✅ 100% | ✅ 100% | 100% | Complete | Medium |

### Legend
- ✅ Completed/High Progress (80-100%)
- 🚧 In Progress/Medium Progress (30-79%)
- 📋 Not Started/Low Progress (0-29%)

### Summary by Status
- **Complete**: Item Master (100%), Materials (100%), Sales Orders (100%), Goods Receipt (100%), Production (100%), Inventory Management (100%), Goods Issuance (100%), User Management (100%), BOM (100%), Service Configuration (100%), Add-ons & Inclusion Rules (100%)
- **In Progress**: Infrastructure (70%)

## Completion Summary

### Backend API (100% Complete)
- **Fully Completed**: 11 out of 11 modules (Item Master, Inventory Management, Goods Issuance, Goods Receipt, Sales Orders, BOM, Production, Materials, User Management, Infrastructure, Service Configuration, Add-ons & Inclusion Rules)
- **In Progress**: 0 modules
- **Not Started**: 0 modules

### Frontend UI (100% Complete)
- **Fully Completed**: 11 modules (Item Master, Materials, Sales Orders, Goods Receipt, Production, Inventory Management, Goods Issuance, User Management, BOM, Service Configuration, Add-ons & Inclusion Rules)
- **In Progress**: 0 modules
- **Not Started**: 0 modules

### Overall Project (100% Complete - Core MRP)
- **Backend Complete**: 11/11 modules ready
- **UI Complete**: 11/11 modules complete
- **Next Priority**: Infrastructure deployment and Phase 2 enhancements

## Next Steps

### Phase 1: Complete UI for Core Operations Modules
1. **✅ Build UI for Production module** (COMPLETED)
   - ✅ Production batch creation UI
   - ✅ Material consumption tracking
   - ✅ Production completion workflow
   - ✅ Status-based edit controls
   - ✅ Real-time form updates during processing

2. **✅ Build UI for Inventory Management** (COMPLETED)
   - ✅ Stock ledger view with filters
   - ✅ Stock adjustment forms with DRAFT/APPROVE/CANCEL workflow
   - ✅ Stock transfer workflow with PENDING/APPROVE/SHIP/RECEIVE/CANCEL workflow

3. **✅ Build UI for Goods Issuance** (COMPLETED)
   - ✅ Issuance request forms
   - ✅ Approval workflow
   - ✅ Warehouse/location selection

4. **✅ Build UI for BOM module** (COMPLETED)
   - ✅ BOM creation/editing
   - ✅ BOM versioning
   - ✅ Cost calculation display

5. **✅ Build Operations Dashboard** (COMPLETED)
   - ✅ Dashboard statistics and metrics
   - ✅ Key metrics overview (inventory, production, sales)
   - ✅ Real-time data visualization
   - ✅ Backend API for dashboard data
   - ✅ Frontend dashboard components

### Phase 2: Complete Missing Modules & Technical Improvements

| Task | Backend | Frontend/Portal | Testing | Overall | Status | Priority |
|------|---------|-----------------|---------|---------|---------|----------|
| **Service Configuration (Printing MRP) Frontend** | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% | Complete | **High** |
| **Add-ons & Inclusion Rules Frontend** | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% | Complete | **High** |
| **Selectable Values API** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **High** |
| **Entity Manager Cleanup** | - | 📋 0% | 📋 0% | 📋 0% | Not Started | **High** |
| **Form Component Creation** | - | 📋 0% | 📋 0% | 📋 0% | Not Started | **High** |
| **Sales Invoice** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **High** |
| **Automated Tests** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **High** |
| **Stock Ledger balance_after column** | 📋 0% | - | 📋 0% | 📋 0% | Not Started | Medium |
| **Stock Transfer relations fix** | 📋 0% | - | 📋 0% | 📋 0% | Not Started | Medium |
| **Procurement Module** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium** |
| **Purchase Orders** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium** |
| **Supplier Management** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium** |
| **Customer Management** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium** |
| **Accounts Payable (AP)** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium-Low** |
| **Financial Reporting** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium-Low** |
| **Cash Flow Analysis** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Medium-Low** |
| **Executive Dashboard** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Low** |
| **Project Management** | 📋 0% | 📋 0% | 📋 0% | 📋 0% | Not Started | **Low** |

**Selectable Values API Details:**
- Create dedicated route for warehouses, locations, and other selectable dropdown values
- Optimize API responses for faster form loading
- Implement caching for frequently accessed reference data
- Support batch loading of multiple reference types in single request
- Reduce API calls for form dropdowns

**Entity Manager Cleanup & Form Component Details:**
- Refactor entity manager for cleaner code structure
- Create reusable form component to handle all form operations
- Improve maintainability and reduce code duplication
- Standardize form validation and error handling
- Make forms easier to extend and customize

**New Module Details:**

**Sales Invoice (Phase 2B):**
- Auto-generate invoices from delivered sales orders
- Invoice numbering and tracking
- Tax calculation and reporting
- Payment status tracking
- Customer statements and aging reports
- Integration with Sales Orders for seamless flow

**Procurement Module (Phase 2C):**
- Purchase Request creation and approval workflow
- Supplier quotation management
- Purchase Order generation from approved requests
- Procurement analytics and reporting
- Budget tracking and control

**Purchase Orders (Phase 2C):**
- PO creation with supplier and item details
- PO approval workflow
- PO status tracking (DRAFT → APPROVED → SENT → PARTIAL RECEIPT → COMPLETE)
- Integration with Goods Receipt for automatic PO closure
- PO variance reporting (price/quantity differences)

**Supplier Management (Phase 2C):**
- Supplier registration and profile management
- Supplier categorization and rating
- Payment terms and banking details
- Supplier performance metrics
- Catalog management per supplier

**Accounts Payable (Phase 2D):**
- Invoice processing from suppliers
- Payment scheduling and execution
- AP aging reports
- Expense categorization
- Cash flow forecasting for payables

**Financial Reporting (Phase 2D):**
- Income Statement (P&L)
- Balance Sheet
- Cash Flow Statement
- Trial Balance
- Custom financial reports with filters
- Export to Excel/PDF

**Cash Flow Analysis (Phase 2D):**
- Real-time cash position
- Cash inflow/outflow tracking
- Cash flow forecasting
- Working capital analysis
- Bank reconciliation tools

**Executive Dashboard (Phase 2E):**
- KPI overview (sales, inventory, production, financial)
- Real-time charts and metrics
- Drill-down capabilities
- Customizable dashboard widgets
- Executive summary reports

**Project Management (Phase 2E):**
- Project creation and tracking
- Task management and assignment
- Project budgeting and cost tracking
- Resource allocation
- Gantt chart visualization
- Project profitability analysis

#### Phase 2 Completion Summary
- **Overall Progress**: 0% Complete (0/17 tasks started)
- **High Priority**: 5 tasks pending (Selectable Values API, Entity Manager Cleanup, Form Component Creation, Sales Invoice, Automated Tests)
- **Medium Priority**: 6 tasks pending (Stock Ledger balance_after, Stock Transfer relations fix, Procurement Module, Purchase Orders, Supplier Management, Customer Management)
- **Medium-Low Priority**: 3 tasks pending (Accounts Payable, Financial Reporting, Cash Flow Analysis)
- **Low Priority**: 2 tasks pending (Executive Dashboard, Project Management)
- **Status**: Not Started

### Phase 3: Demand Forecasting (Future Enhancement)
1. **Implement Demand Forecasting backend**
   - Forecast calculation engine based on historical sales data
   - Multiple forecasting algorithms (moving average, exponential smoothing, seasonal)
   - Forecast accuracy tracking and comparison
   - Forecast API endpoints for finished goods

2. **Implement Demand Forecasting frontend**
   - Forecast dashboard with visual charts
   - Forecast vs actual comparison views
   - Forecast configuration UI (time horizon, algorithm selection)
   - Forecast export functionality

3. **Integrate with Production & Inventory**
   - Use forecasts to suggest production schedules
   - Calculate raw material requirements based on BOM and forecasts
   - Generate purchase order suggestions for raw materials
   - Set dynamic reorder points based on forecasted demand

4. **Advanced Forecasting Features**
   - Customer-specific demand forecasting
   - Seasonal trend analysis
   - Promotional event impact forecasting
   - Forecast confidence intervals

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
