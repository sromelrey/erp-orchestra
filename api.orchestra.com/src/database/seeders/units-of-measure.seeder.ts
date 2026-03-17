import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds sample units of measure for materials and BOM testing.
 */
export const UnitsOfMeasureSeeder: Seeder = {
  name: 'UnitsOfMeasureSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      // Get the system tenant
      const tenantResult = await queryRunner.query(
        `SELECT id FROM "system"."tenants" WHERE slug = $1`,
        ['system'],
      );

      if (tenantResult.length === 0) {
        console.log('  ⚠️  System tenant not found, skipping UOM seeding.');
        return;
      }

      const tenantId = tenantResult[0].id;

      // Check if UOMs already exist
      const existingCount = await queryRunner.query(
        `SELECT COUNT(*) as count FROM "operations"."units_of_measure" WHERE "tenant_id" = $1 AND deleted_at IS NULL`,
        [tenantId],
      );

      if (parseInt(existingCount[0].count) >= 5) {
        console.log('  ⏭️  Units of measure already seeded, skipping...');
        return;
      }

      // Create sample UOMs
      const uoms = [
        { code: 'PCS', name: 'Pieces', precision: 0 },
        { code: 'KG', name: 'Kilograms', precision: 2 },
        { code: 'MTR', name: 'Meters', precision: 2 },
        { code: 'LTR', name: 'Liters', precision: 2 },
        { code: 'BOX', name: 'Box', precision: 0 },
      ];

      for (const uom of uoms) {
        // Check if UOM already exists
        const existing = await queryRunner.query(
          `SELECT id FROM "operations"."units_of_measure" WHERE "tenant_id" = $1 AND "code" = $2 AND deleted_at IS NULL`,
          [tenantId, uom.code],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "operations"."units_of_measure" (
              "tenant_id", "code", "name", "precision", 
              "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, NOW(), NOW())`,
            [tenantId, uom.code, uom.name, uom.precision],
          );
        }
      }

      console.log('  ✅ Created sample units of measure');
    } catch (error) {
      console.error('  ❌ Units of measure seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
