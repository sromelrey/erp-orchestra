# Operations Module Testing Walkthrough

This guide covers manual verification for the Operations master data and warehouse/stock features recently added to the API service. Follow the steps in order in a non-production environment.

> **Pre-requisites**
> - API server running locally (e.g., `npm run start:dev` inside `api.orchestra.com`)
> - Database migrated and seeded (run `npm run migrate` and seeders as needed)
> - Test tenant + user credentials
> - HTTP client (VSCode REST client, Postman, or curl)
> - `API_BASE_URL`, `token`, and sample IDs ready in your environment/collections

---

## 1. Authentication

1. `POST /v1/auth/login` with test credentials.
2. Capture the `accessToken` and set the `Authorization: Bearer <token>` header for all remaining calls.

*Expected*: 200 OK and token response.

---

## 2. Item Master Data

### 2.1 Item Categories
1. **Create** – `POST /v1/ops/item-categories`
   ```json
   { "code": "FAB", "name": "Fabric Rolls", "description": "Greige cotton" }
   ```
   *Expect*: 201 with persisted entity.
2. **List** – `GET /v1/ops/item-categories`
   *Expect*: Array containing the new category.
3. **Update** – `PATCH /v1/ops/item-categories/{id}`
   ```json
   { "name": "Premium Fabric Rolls", "description": "Updated spec" }
   ```
   *Expect*: 200 with updated fields.

### 2.2 Units of Measure
1. **Create** – `POST /v1/ops/item-uoms`
   ```json
   { "code": "MTR", "name": "Meter", "precision": 2 }
   ```
2. **List** – `GET /v1/ops/item-uoms`
3. **Update** – `PATCH /v1/ops/item-uoms/{id}`
   ```json
   { "name": "Meter (m)", "precision": 3 }
   ```

*Expect*: Validation errors if duplicate codes are used; otherwise success responses.

### 2.3 Items
1. **Create** – `POST /v1/ops/items`
   ```json
   {
     "code": "TSHIRT-WHT-001",
     "name": "Basic White Tee",
     "description": "Crew neck, 180gsm cotton",
     "categoryId": <categoryId>,
     "baseUomId": <uomId>,
     "isActive": true
   }
   ```
2. **List** – `GET /v1/ops/items`
   *Expect*: Response includes `category` and `baseUom` relations.
3. **Update** – `PATCH /v1/ops/items/{id}`
   ```json
   { "description": "Updated fabric blend", "isActive": true }
   ```
4. (Optional) Attempt to change `categoryId` to `null` and confirm the association clears.

*Validation checks*: duplicate codes should throw 400; invalid `uomId` or `categoryId` should throw 400/404 as implemented.

---

## 3. Warehouse Management

### 3.1 Warehouses
1. **Create** – `POST /v1/ops/warehouses`
   ```json
   { "code": "WH-MNL", "name": "Manila Fulfillment", "isDefault": true }
   ```
2. **List** – `GET /v1/ops/warehouses`
3. **Update** – `PATCH /v1/ops/warehouses/{id}` to rename or toggle active/default flags.

### 3.2 Locations
1. **Create** – `POST /v1/ops/warehouses/{warehouseId}/locations`
   ```json
   { "code": "PICK-PACK", "name": "Picking Bay", "isActive": true }
   ```
   - Optionally create a nested location by passing `parentId`.
2. **List** – `GET /v1/ops/warehouses/{warehouseId}/locations`
   *Expect*: Locations ordered by `path` with accurate `depth`.
3. **Update** – `PATCH /v1/ops/warehouses/{warehouseId}/locations/{locationId}` to move under a new parent or deactivate.

*Validation*: Duplicate codes per warehouse should be rejected; parent must belong to same tenant/warehouse.

---

## 4. Stock Movements and Balances

1. **Record Receipt** – `POST /v1/ops/stock-movements`
   ```json
   {
     "warehouseId": <warehouseId>,
     "locationId": null,
     "itemId": <itemId>,
     "uomId": <uomId>,
     "movementType": "RECEIPT",
     "quantity": 10,
     "referenceType": "PO",
     "referenceCode": "PO-001",
     "memo": "Initial stock",
     "documentDate": "2026-03-16T08:00:00Z"
   }
   ```
   *Expect*: 201 response and stock ledger row.
2. **Record Issue** – repeat with `movementType: "ISSUE"`, `quantity`: 4.
3. **Ledger Review** – `GET /v1/ops/stock-ledger` (or tenant-scoped listing if exposed). Ensure entries are ordered by `documentDate` desc + `id` desc.
4. **Balance Verification** – query `stock_balances` table (via DB or future endpoint) and confirm `onHandQty` increments/decrements correctly and that `locationId` null lookups work because of the `IsNull()` fix.

*Edge cases*:
- Receipts/Issues referencing invalid warehouses, items, UoMs, or locations should throw `BadRequestException`/`NotFoundException`.
- Duplicate balance rows should not be created thanks to the unique scope index.

---

## 5. Permissions & RBAC Smoke Test

1. Ensure the seeded permissions include:
   - `operations.item.view/manage`
   - `operations.category.manage`
   - `operations.uom.manage`
   - `operations.warehouse.manage`
   - `operations.stock.manage/view`
2. Assign roles to a test user and verify: removing a permission blocks the associated endpoint with 403.

---

## 6. Optional: UI/Integration Shakedown

If the frontend consumes these APIs:
1. Open the relevant admin portal (core or portal) and confirm forms can create/update categories, UoMs, items, warehouses, and locations.
2. Trigger stock movements via UI flow, then verify ledger/balance entries reflect the API behavior.

---

## 7. Regression Checklist

- [ ] Duplicate codes are rejected for categories, UoMs, items, and warehouse entities.
- [ ] Items require valid tenant-scoped category & UoM references.
- [ ] Warehouse locations enforce tenant + warehouse scope for parents.
- [ ] Stock ledger persists correct signed quantities.
- [ ] Stock balance creates/updates a single row per `(tenant, warehouse, location (nullable), item, uom)` combination.
- [ ] New indexes exist in DB (`
\d operations.stock_balances`, etc.).
- [ ] Permissions seeder contains both items and warehouse/stock slugs (re-run seeder if needed).

Use this document as a repeatable QA script before merging or deploying operations-related changes.
