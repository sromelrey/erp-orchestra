# EPIC-08-2: Inventory Transactions

## 🎯 Objective
Implement Goods Receipt and Sales Order transactions with proper stock management

## 📊 Status
**Status:** Planning  
**Priority:** HIGH  
**Target Completion:** Week 2  
**Module:** Inventory / Transactions  

---

## 📋 Stories

### Story 1: Goods Receipt UI Implementation
**ID:** MRP-002  
**Points:** 8  
**Status:** To Do  

**Description:**
Build the frontend interface for Goods Receipt to handle stock-in transactions

**Acceptance Criteria:**
- [ ] Create goods receipt list page (`/inventory/goods-receipt`)
- [ ] Create goods receipt creation form
- [ ] Auto-update stock on receipt
- [ ] Generate stock movement entries
- [ ] Support for multiple items in single receipt
- [ ] Print receipt functionality
- [ ] Reference to purchase orders (optional)

**Technical Tasks:**
- [ ] Create goods receipt pages in Next.js
- [ ] Implement goods receipt API integration
- [ ] Add stock update logic
- [ ] Create receipt PDF template
- [ ] Add validation for item quantities

**Dependencies:**
- Item Master Enhancement (EPIC-08-1)
- Stock Movement service

---

### Story 2: Sales Orders with Stock Allocation
**ID:** MRP-003  
**Points:** 8  
**Status:** To Do  

**Description:**
Implement Sales Orders UI with stock reservation and allocation capabilities

**Acceptance Criteria:**
- [ ] Create sales order list page (`/sales/orders`)
- [ ] Create sales order creation form
- [ ] Real-time stock validation during order creation
- [ ] Stock reservation on order confirmation
- [ ] Order status workflow (Draft → Confirmed → Shipped → Cancelled)
- [ ] Order cancellation with stock release
- [ ] Customer selection and management

**Technical Tasks:**
- [ ] Implement sales order pages
- [ ] Add stock validation service
- [ ] Create stock reservation logic
- [ ] Update stock table with reserved_quantity
- [ ] Create customer management components

**Dependencies:**
- Item Master Enhancement (EPIC-08-1)
- Goods Receipt implementation

---

### Story 3: Stock Transfers
**ID:** MRP-009  
**Points:** 5  
**Status:** To Do  

**Description:**
Enable stock transfers between warehouses

**Acceptance Criteria:**
- [ ] Stock transfer form
- [ ] Transfer approval workflow
- [ ] Automatic stock movement generation
- [ ] Transfer history tracking
- [ ] Inter-warehouse stock validation

**Technical Tasks:**
- [ ] Create transfer entities
- [ ] Implement transfer logic
- [ ] Build transfer UI
- [ ] Add approval workflow

**Dependencies:**
- Goods Receipt implementation
- Sales Orders implementation

---

## 🗂️ File Structure

### Backend
```
src/modules/operations/
├── goods-receipt/
│   ├── goods-receipt.controller.ts
│   ├── goods-receipt.service.ts
│   ├── goods-receipt.entity.ts
│   └── dto/
├── sales/
│   ├── sales-orders.controller.ts
│   ├── sales-orders.service.ts
│   ├── sales-order.entity.ts
│   └── dto/
└── stock-transfers/
    ├── stock-transfers.controller.ts
    ├── stock-transfers.service.ts
    └── dto/
```

### Frontend
```
app/(main)/
├── inventory/
│   └── goods-receipt/
│       ├── page.tsx
│       ├── create/page.tsx
│       └── [id]/page.tsx
├── sales/
│   └── orders/
│       ├── page.tsx
│       ├── create/page.tsx
│       └── [id]/page.tsx
└── inventory/
    └── transfers/
        ├── page.tsx
        └── create/page.tsx
```

---

## 🔄 Workflow

1. Implement Goods Receipt for stock-in
2. Implement Sales Orders for stock-out
3. Add stock transfer capabilities
4. Integrate all with stock ledger

---

## ✅ Definition of Done
- All transactions update stock correctly
- Stock movements are logged for audit
- Stock reservations work properly
- Transfers between warehouses function
- All transactions have proper approval workflows
