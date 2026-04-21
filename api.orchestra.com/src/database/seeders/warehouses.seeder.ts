import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds sample warehouses and locations for sales order testing.
 */
export const WarehousesSeeder: Seeder = {
  name: 'WarehousesSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      // Get the system tenant
      const tenantResult = await queryRunner.query(
        `SELECT id FROM "system"."tenants" WHERE slug = $1`,
        ['system'],
      );

      if (tenantResult.length === 0) {
        console.log(
          '  ⚠️  System tenant not found, skipping warehouse seeding.',
        );
        return;
      }

      const tenantId = tenantResult[0].id;

      // Check if warehouse already exists
      const existingWarehouse = await queryRunner.query(
        `SELECT id FROM "inventory"."warehouses" WHERE "tenant_id" = $1 AND "code" = $2 AND deleted_at IS NULL`,
        [tenantId, 'WH-MAIN'],
      );

      let warehouseId: number;

      if (existingWarehouse.length === 0) {
        // Create warehouse
        const warehouseResult = await queryRunner.query(
          `INSERT INTO "inventory"."warehouses" (
            "tenant_id", "code", "name", "description", "is_default", "is_active",
            "created_at", "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          RETURNING id`,
          [
            tenantId,
            'WH-MAIN',
            'Main Warehouse',
            'Main warehouse for operations',
            true,
            true,
          ],
        );
        warehouseId = warehouseResult[0].id;
        console.log('  ✅ Created warehouse: WH-MAIN');
      } else {
        warehouseId = existingWarehouse[0].id;
        console.log('  ℹ️  Warehouse WH-MAIN already exists, skipping...');
      }

      // Check if location already exists
      const existingLocation = await queryRunner.query(
        `SELECT id FROM "inventory"."warehouse_locations" WHERE "tenant_id" = $1 AND "warehouse_id" = $2 AND "code" = $3 AND deleted_at IS NULL`,
        [tenantId, warehouseId, 'A-01'],
      );

      if (existingLocation.length === 0) {
        // Create location
        await queryRunner.query(
          `INSERT INTO "inventory"."warehouse_locations" (
            "tenant_id", "warehouse_id", "code", "name", "path", "depth", "is_active",
            "created_at", "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [tenantId, warehouseId, 'A-01', 'Location A-01', '/A-01', 1, true],
        );
        console.log('  ✅ Created location: A-01');
      } else {
        console.log('  ℹ️  Location A-01 already exists, skipping...');
      }

      console.log('  ✅ Warehouses seeding completed');
    } catch (error) {
      console.error('  ❌ Warehouses seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
