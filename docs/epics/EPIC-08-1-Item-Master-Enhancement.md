# EPIC-08-1: Item Master Enhancement

## 🎯 Objective
Enhance the item master to support MRP requirements by distinguishing between Raw Materials and Finished Goods

## 📊 Status
**Status:** Planning  
**Priority:** HIGH  
**Target Completion:** Week 1  
**Module:** Inventory / Item Master  

---

## 📋 Stories

### Story: Item Type Separation
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
- [ ] Add item_type to item search and filtering

**Technical Tasks:**
- [ ] Database migration for item_type field
- [ ] Update item entity and DTOs
- [ ] Modify items controller and service
- [ ] Update frontend components
- [ ] Add validation for item_type

**Dependencies:**
- Database access for migration
- Item module refactoring

---

## 🗂️ File Structure

### Backend
```
src/modules/operations/items/
├── items.entity.ts (update)
├── dto/
│   ├── create-item.dto.ts (update)
│   └── update-item.dto.ts (update)
├── items.service.ts (update)
└── migrations/
    └── XXXXXXXXXX-add-item-type.ts
```

### Frontend
```
app/(main)/operations/materials/
├── page.tsx (update)
├── components/
│   ├── item-list.tsx (update)
│   ├── item-form.tsx (update)
│   └── item-type-badge.tsx (new)
```

---

## 🔄 Workflow

1. Database migration adds item_type field
2. Backend updated to handle new field
3. Frontend updated to display and filter by type
4. Testing and validation

---

## ✅ Definition of Done
- All existing items have item_type set (data migration)
- New items require item_type selection
- UI clearly shows item types
- Filters work correctly
- API returns item_type in all responses
