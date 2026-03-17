import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds sample materials for BOM testing and development.
 * This seeder creates sample materials that will be used as parent and component materials in BOMs.
 */
export const MaterialsSeeder: Seeder = {
  name: 'MaterialsSeeder',

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
          '  ⚠️  System tenant not found, skipping materials seeding.',
        );
        return;
      }

      const tenantId = tenantResult[0].id;

      // Check if materials already exist
      const existingCount = await queryRunner.query(
        `SELECT COUNT(*) as count FROM "operations"."materials" WHERE "tenant_id" = $1 AND deleted_at IS NULL`,
        [tenantId],
      );

      if (parseInt(existingCount[0].count) >= 5) {
        console.log('  ⏭️  Materials already seeded, skipping...');
        return;
      }

      // Create sample materials
      const materials = [
        {
          code: 'FG-TSHIRT-001',
          name: 'T-Shirt Finished Good',
          description: 'Completed T-Shirt ready for sale',
          materialType: 'FINISHED',
          materialGroup: 'FINISHED_GOODS',
          baseUom: 'PCS',
          netWeight: 0.2,
          weightUom: 'KG',
        },
        {
          code: 'SF-FABRIC-001',
          name: 'Cotton Fabric Cut',
          description: 'Pre-cut cotton fabric pieces',
          materialType: 'SEMI_FINISHED',
          materialGroup: 'SEMI_FINISHED',
          baseUom: 'PCS',
          netWeight: 0.15,
          weightUom: 'KG',
        },
        {
          code: 'RM-COTTON-001',
          name: 'Cotton Fabric Roll',
          description: 'Raw cotton fabric in rolls',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'MTR',
          netWeight: 0.5,
          weightUom: 'KG',
        },
        {
          code: 'RM-THREAD-001',
          name: 'Sewing Thread',
          description: 'High-quality sewing thread',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'MTR',
          netWeight: 0.001,
          weightUom: 'KG',
        },
        {
          code: 'RM-BUTTON-001',
          name: 'Plastic Button',
          description: 'Plastic buttons for shirts',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'PCS',
          netWeight: 0.005,
          weightUom: 'KG',
        },
      ];

      for (const material of materials) {
        // Check if material already exists
        const existing = await queryRunner.query(
          `SELECT id FROM "operations"."materials" WHERE "tenant_id" = $1 AND "sku" = $2 AND deleted_at IS NULL`,
          [tenantId, material.code],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "operations"."materials" (
              "tenant_id", "sku", "name", "description", "material_type", 
              "material_group", "base_uom", "net_weight", "weight_uom", "is_active", 
              "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
            [
              tenantId,
              material.code,
              material.name,
              material.description,
              material.materialType,
              material.materialGroup || null,
              material.baseUom,
              material.netWeight || null,
              material.weightUom || null,
              true,
            ],
          );
        }
      }

      console.log('  ✅ Created sample materials for BOM testing');
    } catch (error) {
      console.error('  ❌ Materials seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
