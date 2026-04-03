# EPIC-08-3: Bill of Materials

## 🎯 Objective
Implement comprehensive Bill of Materials management for production planning

## 📊 Status
**Status:** Planning  
**Priority:** HIGH  
**Target Completion:** Week 3  
**Module:** Production / BOM  

---

## 📋 Stories

### Story: Bill of Materials Management
**ID:** MRP-004  
**Points:** 13  
**Status:** To Do  

**Description:**
Build comprehensive BOM management interface with versioning and cost calculation

**Acceptance Criteria:**
- [ ] Create BOM list page (`/production/bom`)
- [ ] Create BOM creation/editing form
- [ ] Add raw material selection with quantities
- [ ] Implement BOM versioning
- [ ] Cost calculation and rollup
- [ ] BOM approval workflow
- [ ] BOM expiry management
- [ ] BOM copy functionality
- [ ] Where-used report (show which products use a material)
- [ ] Import/export BOM data

**Technical Tasks:**
- [ ] Enhance BOM API endpoints
- [ ] Create BOM frontend components
- [ ] Implement cost calculation service
- [ ] Add version control logic
- [ ] Create BOM validation rules
- [ ] Add BOM printing functionality

**Dependencies:**
- Item Master Enhancement (EPIC-08-1)
- Raw materials must be properly categorized

---

## 🗂️ File Structure

### Backend
```
src/modules/operations/bill-of-materials/
├── bom.controller.ts (enhance)
├── bom.service.ts (enhance)
├── bom.entity.ts (update)
├── bom-item.entity.ts
├── bom-version.entity.ts
├── dto/
│   ├── create-bom.dto.ts
│   ├── update-bom.dto.ts
│   └── bom-item.dto.ts
├── services/
│   ├── cost-calculation.service.ts
│   └── bom-validation.service.ts
└── queries/
    └── where-used.query.ts
```

### Frontend
```
app/(main)/production/bom/
├── page.tsx
├── create/page.tsx
├── [id]/
│   ├── page.tsx
│   └── edit/page.tsx
├── components/
│   ├── bom-form.tsx
│   ├── bom-item-list.tsx
│   ├── cost-breakdown.tsx
│   └── version-history.tsx
└── reports/
    └── where-used/page.tsx
```

---

## 🔄 Workflow

1. Create BOM with finished good and raw materials
2. Calculate total cost based on material costs
3. Submit for approval
4. Activate BOM for production use
5. Track versions and changes

---

## 📊 Data Model

```sql
-- Enhanced BOM Structure
CREATE TABLE bom_versions (
    id SERIAL PRIMARY KEY,
    bom_id INTEGER NOT NULL,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, APPROVED, ACTIVE, OBSOLETE
    effective_date DATE,
    expiry_date DATE,
    total_cost DECIMAL(12,2),
    created_by INTEGER,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    notes TEXT
);

CREATE TABLE bom_items (
    id SERIAL PRIMARY KEY,
    bom_version_id INTEGER NOT NULL,
    raw_material_id INTEGER NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    waste_percent DECIMAL(5,2) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    alternate_material_id INTEGER, -- For substitutions
    notes TEXT
);
```

---

## ✅ Definition of Done
- BOM can be created with multiple materials
- Cost calculation is accurate
- Version control works properly
- Approval workflow is functional
- BOM can be copied and modified
- Where-used report shows dependencies
- Expired BOMs cannot be used in production
