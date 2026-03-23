# Operations API Testing Walkthrough

A concise, ordered checklist to exercise the Operations module endpoints from basics to latest features.

> **Prep**
> - API running (e.g., `npm run start:dev`).
> - DB migrated/seeded or appropriate fixtures loaded.
> - Have `API_BASE_URL` and an auth token handy (login first).
> - Use a REST client (VSCode REST, Postman, curl).

## 0) Authenticate
- **POST** `/v1/auth/login`
  - Capture `accessToken`; set `Authorization: Bearer <token>` for all calls.

## 1) Master Data (foundation)
1. **Material Master** — define raw materials, semi-finished, and finished goods
   - Purpose: Core inventory items used in production and stored in warehouses.
   - Tests: Create materials with different types (RAW, SEMI_FINISHED, FINISHED, SERVICE), test SKU uniqueness, filter by type/group.
   - POST `/v1/ops/materials` (sku, name, materialType, materialGroup, baseUom)
   - GET `/v1/ops/materials` (with pagination, search, filters)
   - GET `/v1/ops/materials/{id}`
   - PATCH `/v1/ops/materials/{id}`
   - DELETE `/v1/ops/materials/{id}` (soft delete)
2. **Item Categories** — define logical groupings for items (e.g., fabric, trims)
   - POST `/v1/ops/item-categories`
   - GET `/v1/ops/item-categories`
   - PATCH `/v1/ops/item-categories/{id}`
3. **Units of Measure** — register base/transactional UoMs; precision controls decimals
   - POST `/v1/ops/item-uoms`
   - GET `/v1/ops/item-uoms`
   - PATCH `/v1/ops/item-uoms/{id}`
4. **Items** — create stocked/sellable items linked to category + base UoM
   - POST `/v1/ops/items` (use categoryId + uomId from above)
   - GET `/v1/ops/items`
   - PATCH `/v1/ops/items/{id}`

## 2) Warehouses & Locations
1. **Warehouses** — define storage sites (can mark defaults)
   - Purpose: represent physical facilities; default flag used for fallback receipts/issues.
   - Tests: create, list, update name/default flags; ensure tenant scoping works.
   - POST `/v1/ops/warehouses`
   - GET `/v1/ops/warehouses`
   - PATCH `/v1/ops/warehouses/{id}`
2. **Locations** — nested locations inside a warehouse (bins/bays); maintains path/depth
   - Purpose: hierarchical bins with path/depth for picking/putaway; must belong to same warehouse.
   - Tests: create top-level and child locations, list ordering by path, move/update, inactive behavior.
   - POST `/v1/ops/warehouses/{warehouseId}/locations`
   - GET `/v1/ops/warehouses/{warehouseId}/locations`
   - PATCH `/v1/ops/warehouses/{warehouseId}/locations/{locationId}`

## 3) Stock Ledger & Balances (quick smoke)
1. **Record Movement** — POST `/v1/ops/stock-ledger` (receipt/issue/transfer/adjustment)
   - Purpose: writes signed quantity to ledger; updates balances atomically.
   - Tests: receipt then issue same item/UoM; expect ledger entries ordered by documentDate/id.
2. **Verify Balances** — query balances endpoint/table (as available)
   - Expect net on-hand aligns with movements; unique scope `(tenant, warehouse, location?, item, uom)` remains single-row per combo.

## 4) BOM Master
1. **BOMs**
   - POST `/v1/ops/bom` (parent item + version; include items/components)
   - GET `/v1/ops/bom?limit=&offset=` (listing/pagination)
   - GET `/v1/ops/bom/{id}` (detail)
   - PATCH `/v1/ops/bom/{id}` (update metadata / status)
2. **BOM Where-Used**
   - GET `/v1/ops/bom/component/{componentId}/where-used`

## 5) Stock Movements & Balances
1. **Record Movement**
   - Purpose: central entry point for receipts/issues/transfers/adjustments; updates ledger + balances.
   - POST `/v1/ops/stock-ledger` (e.g., RECEIPT then ISSUE for same item/UoM)
2. **Ledger Review**
   - Purpose: confirm movement history ordering and signed quantities.
   - GET `/v1/ops/stock-ledger` (or tenant-scoped listing as available)
3. **Balance Check**
   - Purpose: verify on-hand per `(tenant, warehouse, location?, item, uom)` matches net movements.
   - Query balances table/endpoint if exposed; expect single row per scope.
   - Verify `stock_balances` (via DB or endpoint if exposed) reflects net quantities.

## 6) BOM Costing (latest feature)
1. **Calculate & Save Cost**
   - POST `/v1/ops/bom/{id}/cost/calculate` (payload: `bomId`, `costingMethod`, `outputQuantity`, `costUom`, flags)
2. **Costing History**
   - GET `/v1/ops/bom/{id}/costing?limit=&offset=&costingDateFrom=&costingDateTo=`
3. **Latest Cost**
   - GET `/v1/ops/bom/{id}/cost/latest`
4. **Legacy Cost Views** (if still needed)
   - GET `/v1/ops/bom/{id}/cost`
   - GET `/v1/ops/bom/{id}/cost/breakdown`

## 7) RBAC/Permissions Smoke
- Try one create/read endpoint with and without required permissions (e.g., `operations.bom.cost` and `operations.bom.view`) to confirm 403s when revoked.

## Notes & Tips
- Respect tenant scoping for all IDs (materialId, categoryId, uomId, itemId, warehouseId, BOM ids, etc.).
- Use pagination params `limit/offset` where supported.
- Material types: RAW, SEMI_FINISHED, FINISHED, SERVICE.
- Material SKU must be unique per tenant.
- For BOM costing date filters, use ISO dates (`YYYY-MM-DD` or full timestamps).
- Reset per-schema if needed: `npm run db:reset -- operations`.
