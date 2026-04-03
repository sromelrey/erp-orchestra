# EPIC-08-4: Production Management

## 🎯 Objective
Implement production batch processing with material consumption and finished goods receipt

## 📊 Status
**Status:** Planning  
**Priority:** HIGH  
**Target Completion:** Week 4  
**Module:** Production / Batch Processing  

---

## 📋 Stories

### Story: Production Batch Management
**ID:** MRP-005  
**Points:** 13  
**Status:** To Do  

**Description:**
Implement production batch processing with material consumption and finished goods receipt

**Acceptance Criteria:**
- [ ] Create production batch list page (`/production/batches`)
- [ ] Create batch creation from BOM
- [ ] Material consumption recording
- [ ] Production completion with finished goods receipt
- [ ] Waste/defect tracking
- [ ] Batch status tracking (Planned → In Progress → Completed → Cancelled)
- [ ] Production scheduling
- [ ] Batch cost tracking
- [ ] Material issuance documents
- [ ] Production completion reports

**Technical Tasks:**
- [ ] Create production batch entities
- [ ] Implement batch API endpoints
- [ ] Build production frontend
- [ ] Create stock transaction logic for production
- [ ] Add batch numbering system
- [ ] Implement production scheduling

**Dependencies:**
- Bill of Materials (EPIC-08-3)
- Inventory Transactions (EPIC-08-2)

---

## 🗂️ File Structure

### Backend
```
src/modules/operations/production/
├── batches/
│   ├── production-batches.controller.ts
│   ├── production-batches.service.ts
│   ├── production-batch.entity.ts
│   └── dto/
├── consumption/
│   ├── material-consumption.service.ts
│   └── material-consumption.entity.ts
├── scheduling/
│   ├── production-schedule.service.ts
│   └── production-schedule.entity.ts
└── queries/
    ├── batch-status.query.ts
    └── production-efficiency.query.ts
```

### Frontend
```
app/(main)/production/batches/
├── page.tsx
├── create/page.tsx
├── [id]/
│   ├── page.tsx
│   ├── start/page.tsx
│   ├── complete/page.tsx
│   └── consume/page.tsx
├── schedule/
│   ├── page.tsx
│   └── calendar.tsx
└── reports/
    └── efficiency/page.tsx
```

---

## 🔄 Workflow

1. Create production batch from BOM
2. Plan materials required
3. Issue materials to production
4. Start production batch
5. Record actual consumption
6. Record waste/defects
7. Complete production
8. Receive finished goods

---

## 📊 Data Model

```sql
-- Production Batch Structure
CREATE TABLE production_batches (
    id SERIAL PRIMARY KEY,
    batch_no VARCHAR(50) UNIQUE NOT NULL,
    bom_id INTEGER NOT NULL,
    bom_version_id INTEGER NOT NULL,
    planned_quantity DECIMAL(15,6) NOT NULL,
    actual_quantity DECIMAL(15,6),
    status VARCHAR(20) DEFAULT 'PLANNED',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    planned_start_date DATE,
    planned_end_date DATE,
    supervisor_id INTEGER,
    notes TEXT,
    total_cost DECIMAL(12,2),
    waste_percentage DECIMAL(5,2)
);

CREATE TABLE material_consumption (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    planned_quantity DECIMAL(15,6) NOT NULL,
    issued_quantity DECIMAL(15,6),
    consumed_quantity DECIMAL(15,6),
    returned_quantity DECIMAL(15,6) DEFAULT 0,
    waste_quantity DECIMAL(15,6) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2)
);

CREATE TABLE production_outputs (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    quality_grade VARCHAR(20), -- A, B, C, REJECT
    location_id INTEGER,
    batch_reference VARCHAR(50), -- For traceability
    produced_date TIMESTAMP
);
```

---

## 🎯 Key Features

### Material Management
- Automatic material reservation
- Material issuance documents
- Real-time consumption tracking
- Waste and defect recording

### Production Control
- Batch status tracking
- Production scheduling
- Progress monitoring
- Quality control integration

### Cost Tracking
- Standard vs actual cost comparison
- Material variance analysis
- Labor and overhead allocation
- Batch profitability analysis

---

## ✅ Definition of Done
- Production batches can be created from BOM
- Material consumption is accurately tracked
- Finished goods are received into inventory
- Production costs are calculated
- Batch status workflow is functional
- Production scheduling works
- Waste and defects are properly recorded
