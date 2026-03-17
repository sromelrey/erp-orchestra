import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds sample BOM data for testing and development.
 * This seeder creates sample materials and BOMs to demonstrate the BOM functionality.
 */
export const BomSeeder: Seeder = {
  name: 'BomSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    const createBom = async (
      queryRunner: any,
      bomData: {
        tenantId: number;
        parentMaterialId: number;
        code: string;
        name: string;
        version: string;
        status: string;
        effectiveDate?: Date;
        expiryDate?: Date;
      },
      items: Array<{
        componentMaterialId: number;
        quantity: number;
        uom: string;
        scrapPercentage: number;
        sortOrder: number;
      }>,
    ): Promise<any> => {
      // Check if BOM already exists
      const existing = await queryRunner.query(
        `SELECT id FROM "operations"."boms" 
         WHERE "tenant_id" = $1 AND "parent_material_id" = $2 AND "version" = $3 AND deleted_at IS NULL`,
        [bomData.tenantId, bomData.parentMaterialId, bomData.version],
      );

      if (existing.length > 0) {
        console.log(
          `  ⏭️  BOM ${bomData.code} version ${bomData.version} already exists, skipping...`,
        );
        return existing[0];
      }

      // Insert BOM
      const bomResult = await queryRunner.query(
        `INSERT INTO "operations"."boms" (
          "tenant_id", "parent_material_id", "code", "name", "version", 
          "status", "effective_date", "expiry_date", "is_active", 
          "created_at", "updated_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id`,
        [
          bomData.tenantId,
          bomData.parentMaterialId,
          bomData.code,
          bomData.name,
          bomData.version,
          bomData.status,
          bomData.effectiveDate || null,
          bomData.expiryDate || null,
          true,
        ],
      );

      const bomId = bomResult[0].id;

      // Insert BOM items
      for (const item of items) {
        await queryRunner.query(
          `INSERT INTO "operations"."bom_items" (
            "bom_id", "component_material_id", "quantity", "uom", 
            "scrap_percentage", "sort_order", "created_at", "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            bomId,
            item.componentMaterialId,
            item.quantity,
            item.uom,
            item.scrapPercentage,
            item.sortOrder,
          ],
        );
      }

      return { id: bomId };
    };

    try {
      // Get the system tenant
      const tenantResult = await queryRunner.query(
        `SELECT id FROM "system"."tenants" WHERE slug = $1`,
        ['system'],
      );

      if (tenantResult.length === 0) {
        console.log('  ⚠️  System tenant not found, skipping BOM seeding.');
        return;
      }

      const tenantId = tenantResult[0].id;

      // Check if materials exist
      const materialsExist = await queryRunner.query(
        `SELECT COUNT(*) as count FROM "operations"."materials" WHERE "tenant_id" = $1 AND deleted_at IS NULL`,
        [tenantId],
      );

      if (parseInt(materialsExist[0].count) < 3) {
        console.log(
          '  ⚠️  Not enough materials found for BOM seeding. Please seed materials first.',
        );
        return;
      }

      // Get sample materials
      const materials = await queryRunner.query(
        `SELECT id, name FROM "operations"."materials" WHERE "tenant_id" = $1 AND deleted_at IS NULL ORDER BY id LIMIT 5`,
        [tenantId],
      );

      if (materials.length < 3) {
        console.log('  ⚠️  Need at least 3 materials to create sample BOMs.');
        return;
      }

      // Create sample BOMs
      const bom1 = await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: materials[0].id, // Finished good
          code: 'BOM-FG-001',
          name: `Finished Good BOM for ${materials[0].name}`,
          version: '1.0',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: materials[1].id,
            quantity: 2.5,
            uom: 'PCS',
            scrapPercentage: 5,
            sortOrder: 1,
          },
          {
            componentMaterialId: materials[2].id,
            quantity: 1.0,
            uom: 'KG',
            scrapPercentage: 2,
            sortOrder: 2,
          },
        ],
      );

      const bom2 = await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: materials[1].id, // Semi-finished
          code: 'BOM-SF-001',
          name: `Semi-finished BOM for ${materials[1].name}`,
          version: '1.0',
          status: 'DRAFT',
        },
        [
          {
            componentMaterialId: materials[2].id,
            quantity: 0.5,
            uom: 'KG',
            scrapPercentage: 3,
            sortOrder: 1,
          },
        ],
      );

      // Create a second version of the first BOM to demonstrate versioning
      if (bom1 && materials.length >= 4) {
        await createBom(
          queryRunner,
          {
            tenantId,
            parentMaterialId: materials[0].id,
            code: 'BOM-FG-001',
            name: `Updated BOM for ${materials[0].name}`,
            version: '2.0',
            status: 'DRAFT',
            effectiveDate: new Date(),
          },
          [
            {
              componentMaterialId: materials[1].id,
              quantity: 2.0, // Reduced quantity
              uom: 'PCS',
              scrapPercentage: 4,
              sortOrder: 1,
            },
            {
              componentMaterialId: materials[3]?.id || materials[2].id,
              quantity: 1.5,
              uom: 'KG',
              scrapPercentage: 2,
              sortOrder: 2,
            },
          ],
        );
      }

      console.log('  ✅ Created sample BOMs and BOM items');
    } catch (error) {
      console.error('  ❌ BOM seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
