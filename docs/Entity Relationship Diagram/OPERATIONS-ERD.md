# Operations Module ERD

This document describes the database structure for the Operations module, including item master, warehouse management, and stock tracking.

```dbml
// Operations Module - Item Master, Warehouses, and Stock Management

Table item_categories {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  code varchar(50) [not null, unique]
  name varchar(255) [not null]
  description text
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

Table units_of_measure {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  code varchar(50) [not null, unique]
  name varchar(255) [not null]
  precision integer [default: 0]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

Table items {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  code varchar(100) [not null, unique]
  name varchar(255) [not null]
  description text
  category_id uuid [ref: > item_categories.id]
  base_uom_id uuid [ref: > units_of_measure.id]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

Table item_units {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  item_id uuid [ref: > items.id, not null]
  uom_id uuid [ref: > units_of_measure.id, not null]
  conversion_factor numeric(15,6) [not null]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

// Warehouse Management

Table warehouses {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  code varchar(50) [not null, unique]
  name varchar(255) [not null]
  address text
  is_active boolean [default: true]
  is_default boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

Table warehouse_locations {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  warehouse_id uuid [ref: > warehouses.id, not null]
  parent_id uuid [ref: > warehouse_locations.id]
  code varchar(50) [not null]
  name varchar(255) [not null]
  path varchar(1000)
  depth integer [default: 0]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
  
  indexes {
    (warehouse_id, code) [unique]
    (tenant_id, path)
  }
}

// Stock Management

Table stock_ledger {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  warehouse_id uuid [ref: > warehouses.id, not null]
  location_id uuid [ref: > warehouse_locations.id]
  item_id uuid [ref: > items.id, not null]
  uom_id uuid [ref: > units_of_measure.id, not null]
  movement_type varchar(20) [not null] // RECEIPT, ISSUE, TRANSFER, ADJUSTMENT
  quantity numeric(15,6) [not null]
  reference_type varchar(50) // PO, SO, ADJ, TRANSFER
  reference_code varchar(100)
  memo text
  document_date timestamp [not null]
  created_at timestamp [default: `now()`]
  created_by uuid
  
  indexes {
    (tenant_id, warehouse_id, item_id, document_date)
    (tenant_id, item_id, document_date)
    (reference_type, reference_code)
  }
}

Table stock_balances {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  warehouse_id uuid [ref: > warehouses.id, not null]
  location_id uuid [ref: > warehouse_locations.id]
  item_id uuid [ref: > items.id, not null]
  uom_id uuid [ref: > units_of_measure.id, not null]
  on_hand_qty numeric(15,6) [default: 0]
  reserved_qty numeric(15,6) [default: 0]
  available_qty numeric(15,6) [default: 0]
  last_movement_date timestamp
  updated_at timestamp [default: `now()`]
  
  indexes {
    (tenant_id, warehouse_id, location_id, item_id, uom_id) [unique]
    (tenant_id, item_id)
    (tenant_id, warehouse_id, item_id)
  }
}

// Bill of Materials

Table bom_headers {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  code varchar(100) [not null, unique]
  name varchar(255) [not null]
  finished_good_item_id uuid [ref: > items.id, not null]
  version varchar(20) [not null]
  is_active boolean [default: true]
  effective_date date
  expiry_date date
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

Table bom_lines {
  id uuid [pk, unique]
  tenant_id uuid [not null]
  bom_header_id uuid [ref: > bom_headers.id, not null]
  component_item_id uuid [ref: > items.id, not null]
  uom_id uuid [ref: > units_of_measure.id, not null]
  quantity numeric(15,6) [not null]
  scrap_factor numeric(5,4) [default: 0]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid
  updated_by uuid
}

// Sample relationships
Ref: item_categories.created_by > users.id
Ref: items.created_by > users.id
Ref: warehouses.created_by > users.id
Ref: stock_ledger.created_by > users.id
Ref: bom_headers.created_by > users.id
```

## Key Design Notes:

1. **Multi-tenancy**: All tables include `tenant_id` for data isolation
2. **Hierarchical Locations**: Using materialized path pattern for efficient tree queries
3. **Stock Tracking**: Immutable ledger for audit trail, denormalized balances for performance
4. **BOM Versioning**: Support for multiple versions of bills of materials
5. **Unit Conversions**: Items can have multiple UOMs with conversion factors
6. **Audit Fields**: Created/updated timestamps and user references throughout

## Indexes:
- Unique constraints on business keys (codes)
- Composite indexes for common query patterns
- Performance indexes for stock lookups and reporting
