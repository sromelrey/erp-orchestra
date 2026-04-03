# EPIC-08: MRP Core Implementation

## 🎯 Objective
Transform the existing ERP system into a lean MRP-first architecture focusing on the core flow: Raw Materials → Production → Finished Goods → Sales → Cash → Reports

## 📊 Status
**Status:** Planning  
**Priority:** HIGH  
**Target Completion:** 8 weeks  
**Assigned to:** Development Team  

---

## 🏗️ Phase 1: Core Transactions (Weeks 1-2)

### Story 1: Item Type Separation
**ID:** MRP-001  
**Points:** 5  
**Status:** To Do  

**Description:**
Enhance the item master to distinguish between Raw Materials and Finished Goods

**Acceptance Criteria:**
- [ ] Add `item_type` field to items table ('RAW_MATERIAL' | 'FINISHED_GOOD')
- [ ] Update items API to include item_type
- [ ] Update items UI to show RM/FG badges
- [ ] Add filters by item type in items list
- [ ] Update item creation form to require item type selection

**Technical Tasks:**
- [ ] Database migration for item_type field
- [ ] Update item entity and DTOs
- [ ] Modify items controller and service
- [ ] Update frontend components

---

### Story 2: Goods Receipt UI Implementation
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

**Technical Tasks:**
- [ ] Create goods receipt pages in Next.js
- [ ] Implement goods receipt API integration
- [ ] Add stock update logic
- [ ] Create receipt PDF template

---

### Story 3: Sales Orders with Stock Allocation
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
- [ ] Order status workflow (Draft → Confirmed → Shipped)
- [ ] Order cancellation with stock release

**Technical Tasks:**
- [ ] Implement sales order pages
- [ ] Add stock validation service
- [ ] Create stock reservation logic
- [ ] Update stock table with reserved_quantity

---

## 🏭 Phase 2: Production Foundation (Weeks 3-4)

### Story 4: Bill of Materials UI
**ID:** MRP-004  
**Points:** 13  
**Status:** To Do  

**Description:**
Build comprehensive BOM management interface

**Acceptance Criteria:**
- [ ] Create BOM list page (`/production/bom`)
- [ ] Create BOM creation/editing form
- [ ] Add raw material selection with quantities
- [ ] Implement BOM versioning
- [ ] Cost calculation and rollup
- [ ] BOM approval workflow
- [ ] BOM expiry management

**Technical Tasks:**
- [ ] Enhance BOM API endpoints
- [ ] Create BOM frontend components
- [ ] Implement cost calculation service
- [ ] Add version control logic

---

### Story 5: Production Batch Management
**ID:** MRP-005  
**Points:** 13  
**Status:** To Do  

**Description:**
Implement production batch processing with material consumption

**Acceptance Criteria:**
- [ ] Create production batch list page (`/production/batches`)
- [ ] Create batch creation from BOM
- [ ] Material consumption recording
- [ ] Production completion with finished goods receipt
- [ ] Waste/defect tracking
- [ ] Batch status tracking (Planned → In Progress → Completed)

**Technical Tasks:**
- [ ] Create production batch entities
- [ ] Implement batch API endpoints
- [ ] Build production frontend
- [ ] Create stock transaction logic for production

---

## 💰 Phase 3: Financial Integration (Weeks 5-6)

### Story 6: Sales Invoice Integration
**ID:** MRP-006  
**Points:** 8  
**Status:** To Do  

**Description:**
Integrate sales invoice generation with sales orders

**Acceptance Criteria:**
- [ ] Auto-generate invoice from sales order
- [ ] Invoice list page (`/sales/invoices`)
- [ ] Payment tracking functionality
- [ ] Customer account statements
- [ ] Invoice PDF generation
- [ ] Tax calculations

**Technical Tasks:**
- [ ] Connect sales orders to invoice module
- [ ] Create invoice automation logic
- [ ] Build invoice frontend pages
- [ ] Implement payment tracking

---

### Story 7: Basic MRP Reports
**ID:** MRP-007  
**Points:** 8  
**Status:** To Do  

**Description:**
Create essential MRP reports for business insights

**Acceptance Criteria:**
- [ ] Stock Status Report (current levels, movements)
- [ ] Sales Summary Report (revenue, top items, customers)
- [ ] Production Efficiency Report (batch completion, waste)
- [ ] Inventory Valuation Report
- [ ] Export reports to CSV/PDF
- [ ] Report date filters

**Technical Tasks:**
- [ ] Create report services
- [ ] Build report API endpoints
- [ ] Implement report frontend
- [ ] Add export functionality

---

## 📈 Phase 4: Optimization (Weeks 7-8)

### Story 8: MRP Dashboard
**ID:** MRP-008  
**Points:** 5  
**Status:** To Do  

**Description:**
Build a centralized dashboard for MRP metrics

**Acceptance Criteria:**
- [ ] Key metrics overview (stock value, sales, production)
- [ ] Low stock alerts
- [ ] Pending orders queue
- [ ] Production schedule view
- [ ] Recent transactions feed

**Technical Tasks:**
- [ ] Create dashboard API aggregations
- [ ] Build dashboard components
- [ ] Implement real-time updates
- [ ] Add alert system

---

### Story 9: Stock Transfers
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

**Technical Tasks:**
- [ ] Create transfer entities
- [ ] Implement transfer logic
- [ ] Build transfer UI

---

## 🚨 Dependencies & Blockers

### Critical Dependencies:
1. **Database Schema Updates** - Must be completed before Phase 1
2. **Stock Movement Service** - Required for all transaction modules
3. **Authentication/Permissions** - Ensure proper access control

### Potential Blockers:
- Performance issues with stock calculations
- Complex BOM structures affecting performance
- Integration points with existing modules

---

## 📋 Implementation Order (Priority)

### Week 1:
1. **MRP-001: Item Type Separation** (Must be first)
2. Begin **MRP-002: Goods Receipt UI**

### Week 2:
3. Complete **MRP-002: Goods Receipt UI**
4. **MRP-003: Sales Orders with Stock Allocation**

### Week 3:
5. **MRP-004: Bill of Materials UI**
6. Begin **MRP-005: Production Batch Management**

### Week 4:
7. Complete **MRP-005: Production Batch Management**

### Week 5:
8. **MRP-006: Sales Invoice Integration**

### Week 6:
9. **MRP-007: Basic MRP Reports**

### Week 7:
10. **MRP-008: MRP Dashboard**

### Week 8:
11. **MRP-009: Stock Transfers**
12. Buffer week for testing and fixes

---

## 🎯 Success Metrics

- End-to-end flow working: RM receipt → Production → FG → Sales → Invoice
- Stock accuracy > 99.5%
- Report generation < 5 seconds
- User adoption rate > 80%

---

## 📝 Notes

1. **Focus on Core Flow** - Avoid scope creep, stick to MRP essentials
2. **Test Each Phase** - Ensure phase completion before moving to next
3. **Performance First** - Monitor stock calculation performance
4. **User Feedback** - Gather feedback after each phase

---

## 🔗 Related Documents

- [MRP Refocus Plan](../mrp-refocus-plan.md)
- [Database Schema](../database-schema.md)
- [API Documentation](../api/README.md)
