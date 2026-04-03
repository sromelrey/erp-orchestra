# Code Field Auto-Generation

## Description
Currently, all entities (Warehouses, Locations, Items, etc.) require manual input of the `code` field during creation. This should be automatically generated based on predefined patterns to improve user experience and ensure consistency.

## Affected Modules

### System Module
- **System Modules** - POST `/v1/system-modules`
- **Roles** - POST `/v1/system/roles`

### Operations Module
- **Warehouses** - POST `/v1/ops/warehouses`
- **Warehouse Locations** - POST `/v1/ops/warehouses/{warehouseId}/locations`
- **Item Categories** - POST `/v1/ops/item-categories`
- **Units of Measure** - POST `/v1/ops/item-uoms`
- **Items** - POST `/v1/ops/items`
- **Bill of Materials (BOM)** - POST `/v1/ops/bom`

### HRIS Module
- **Designations** - POST `/v1/hris/designations`
- **Departments** - POST `/v1/hris/departments`
- **Branches** - POST `/v1/hris/branches`

## Required Changes

### 1. Frontend Changes
- Disable all `code` input fields in forms
- Add placeholder text: "Auto-generated"
- Remove `required` validation from code fields
- Display generated code after successful creation

### 2. Backend Changes
- Make `code` field optional in all DTOs
- Implement auto-generation logic in services
- Define code patterns for each entity type:
  - Warehouses: `WH-{LOCATION_CODE}-{SEQUENCE}`
  - Locations: `{TYPE_CODE}-{SEQUENCE}`
  - Items: `{CATEGORY_CODE}-{SEQUENCE}`
  - BOM: `BOM-{PARENT_CODE}-{VERSION}`
  - etc.

### 3. Database Changes
- Update constraints to allow null code during creation
- Add unique constraints for generated codes
- Consider adding a sequence table for code generation

## Implementation Priority
1. **High** - Operations Module (Warehouses, Locations, Items)
2. **Medium** - HRIS Module (Departments, Designations, Branches)
3. **Low** - System Module (System Modules, Roles)

## Technical Considerations
- Ensure generated codes are unique within their scope
- Handle concurrent requests to avoid duplicate codes
- Consider using database sequences for reliable generation
- Maintain backward compatibility with existing data

## Testing Requirements
- Test concurrent creation scenarios
- Verify uniqueness constraints
- Test with special characters in names
- Ensure existing records with manual codes still work
