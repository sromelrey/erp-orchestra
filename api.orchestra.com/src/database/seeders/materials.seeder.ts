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

      // Create printing materials (idempotent - each checked individually via ON CONFLICT)
      const materials = [
        // --- Raw Materials: Silk Screen ---
        {
          code: 'SILK-INK',
          name: 'Silk Screen Ink',
          description: 'Ink used for silk screen printing',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'ML',
          netWeight: null,
          weightUom: null,
        },
        {
          code: 'SILK-CHEM',
          name: 'Emulsion / Chemicals',
          description: 'Emulsion and chemicals for silk screen setup',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'ML',
          netWeight: null,
          weightUom: null,
        },
        // --- Raw Materials: Sublimation ---
        {
          code: 'SUBLI-INK',
          name: 'Sublimation Ink',
          description: 'Ink used for sublimation printing',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'ML',
          netWeight: null,
          weightUom: null,
        },
        {
          code: 'SUBLI-PAPER',
          name: 'Sublimation Paper',
          description: 'Transfer paper used in sublimation printing',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'SHEET',
          netWeight: null,
          weightUom: null,
        },
        // --- Raw Materials: Fabric & Add-ons ---
        {
          code: 'FABRIC',
          name: 'Printing Fabric',
          description:
            'Fabric used as base material for printing (measured in meters)',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'MTR',
          netWeight: 0.3,
          weightUom: 'KG',
        },
        {
          code: 'LABEL',
          name: 'Woven Label',
          description: 'Company woven label attached to finished product',
          materialType: 'RAW',
          materialGroup: 'RAW_MATERIALS',
          baseUom: 'PCS',
          netWeight: null,
          weightUom: null,
        },
        // --- Finished Goods: Service Outputs ---
        {
          code: 'FG-SILK-PRINT',
          name: 'Silk Screen Print Output',
          description: 'Finished good output for silk screen printing service',
          materialType: 'FINISHED',
          materialGroup: 'FINISHED_GOODS',
          baseUom: 'PCS',
          netWeight: null,
          weightUom: null,
        },
        {
          code: 'FG-SILK-LABEL',
          name: 'Silk Screen + Label Output',
          description:
            'Finished good output for silk screen printing with label',
          materialType: 'FINISHED',
          materialGroup: 'FINISHED_GOODS',
          baseUom: 'PCS',
          netWeight: null,
          weightUom: null,
        },
        {
          code: 'FG-SUBLIMATION-PRINT',
          name: 'Sublimation Print Output',
          description: 'Finished good output for sublimation printing service',
          materialType: 'FINISHED',
          materialGroup: 'FINISHED_GOODS',
          baseUom: 'PCS',
          netWeight: null,
          weightUom: null,
        },
      ];

      for (const material of materials) {
        // Check if material already exists (SKU must be globally unique)
        const existing = await queryRunner.query(
          `SELECT id FROM "inventory"."materials" WHERE "sku" = $1 AND deleted_at IS NULL`,
          [material.code],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "inventory"."materials" (
              "tenant_id", "sku", "name", "description", "material_type", 
              "material_group", "base_uom", "net_weight", "weight_uom", "is_active", 
              "created_by", "updated_by", "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 2, 2, NOW(), NOW())`,
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

      console.log(
        '  ✅ Created printing materials (raw materials + finished goods)',
      );
    } catch (error) {
      console.error('  ❌ Materials seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
