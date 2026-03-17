# Bill of Materials (BOM) Testing Walkthrough

This guide consolidates database checks, seed data prep, API exercises, and negative scenarios for validating the BOM module end-to-end.

## 1. Prerequisites
1. **Environment**: API service (`api.orchestra.com`) running with access to Postgres.
2. **Migrations**: Run the BOM migration `20260316180000-AddBomTables.ts`.
3. **Seed Data**:
   - `materials.seeder.ts` → ensures finished/semi-finished/raw materials exist.
   - `bom.seeder.ts` → optional sample BOMs for smoke testing.
4. **Auth Context**: Obtain a valid JWT or session cookie (see `bill-of-materials.endpoints.http` login request).

## 2. Database Verification
Reference: `docs/modules/operations/bill-of-materials/docs/database-schema.md`.

| Check | How | Expected |
| --- | --- | --- |
| `operations.boms` columns | `\d operations.boms` or inspect via GUI | Columns, indexes, and `bom_status` enum match doc | 
| `operations.bom_items` FKs | `SELECT conname, confrelid::regclass FROM pg_constraint WHERE conrelid = 'operations.bom_items'::regclass;` | FK to `operations.boms` (cascade) and `operations.materials` (restrict) exist |
| Unique constraints | Attempt duplicate `(tenant_id, parent_material_id, version)` insert via SQL | Insert should fail with `UQ_boms_tenant_material_version` |
| Soft-delete behavior | Update `deleted_at` manually and query indexes | Partial indexes exclude deleted rows |

## 3. Seed & Migration Smoke Test
1. Run migrations → verify new tables.
2. Execute seeders (Materials → BOM). Confirm rows inserted with `SELECT * FROM operations.boms LIMIT 5;`.
3. Run `npm run start:dev` and watch for Nest DI issues.

## 4. API Testing Matrix
Use `bill-of-materials.endpoints.http` as baseline. Suggested order:

| Step | Endpoint | Purpose | Notes |
| --- | --- | --- | --- |
| 1 | `POST /v1/ops/bom` | Create baseline BOM | Validate 201 response + payload |
| 2 | `GET /v1/ops/bom?page=1&limit=20` | Pagination sanity | Expect meta.nextCursor |
| 3 | `GET /v1/ops/bom?search=TSHIRT` | Search filter | Partial match on code/name |
| 4 | `GET /v1/ops/bom/:id` | Fetch detail | Items appear sorted; relations hydrated |
| 5 | `PATCH /v1/ops/bom/:id` | Update + versioning | Confirm version/lines updated |
| 6 | `PATCH /v1/ops/bom/:id/status` | Status transition | Guards uniqueness of active BOM per material |
| 7 | `POST /v1/ops/bom/:id/deactivate` | Soft deactivate | `isActive` flips false |
| 8 | `GET /v1/ops/bom/item/:itemId/active` | Read active BOM | Items sorted by `sortOrder` |
| 9 | `GET /v1/ops/bom/:id/cost` | Cost aggregation | Validates `BomCostingService` |
| 10 | `GET /v1/ops/bom/:id/cost/breakdown` | Scrap-inclusive cost | (New request snippet below) |
| 11 | `GET /v1/ops/bom/component/:componentId/where-used` | Implosion | Expect parent list |
| 12 | `POST /v1/ops/bom/:id/validate` | Cycle detector | Should return `{ "valid": true }` when clean |
| 13 | `DELETE /v1/ops/bom/:id` | Soft delete | Verify `deleted_at` set |

## 5. Negative Scenarios
1. **Circular dependency**: POST payload where a parent references itself (already in `.http`). Expect 400 `BomCycleException`.
2. **Duplicate version**: POST same parent/version pair. Expect 409 `BomVersionExistsException`.
3. **Inactive BOM fetch**: Hit `/item/:itemId/active` after deactivation → expect 404/handled error.
4. **Missing materials**: Remove seed data and attempt create → expect validation error referencing missing components.
5. **Costing with missing standard cost**: Ensure `Material.standardCost` absent → totalCost should still respond (unitCost fallback 0).

## 6. Manual DB Assertions Post-API
After API tests, run queries:
```sql
-- Verify BOM header/line counts
SELECT COUNT(*) FROM operations.boms WHERE tenant_id = 1;
SELECT COUNT(*) FROM operations.bom_items WHERE bom_id = <id>;

-- Ensure ordering persists
SELECT sort_order FROM operations.bom_items WHERE bom_id = <id> ORDER BY sort_order;
```

## 7. Automation Hooks
- Convert `.http` suite to e2e tests (e.g., Jest + Supertest) following the same sequence.
- Use Postman/Newman collection exports for CI smoke tests.
- Consider DB snapshotting before destructive cases.

## 8. Troubleshooting Checklist
1. **Nest DI errors**: Verify providers registered in `BillOfMaterialsModule`.
2. **Foreign key failures**: Confirm material IDs exist, especially after manual cleanups.
3. **Sorting/regression**: Ensure `sortBomItems` helper is invoked after fetches.
4. **Transactional integrity**: Review service methods to ensure BOM + items operations wrap in transactions if extended.

## 9. References
- [`docs/modules/operations/bill-of-materials/docs/database-schema.md`](./database-schema.md)
- [`docs/modules/operations/bill-of-materials/docs/api-examples.md`](./api-examples.md)
- [`src/modules/operations/bill-of-materials/bill-of-materials.endpoints.http`](../../../../src/modules/operations/bill-of-materials/bill-of-materials.endpoints.http)
