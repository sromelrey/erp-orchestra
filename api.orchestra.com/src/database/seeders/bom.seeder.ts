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
          "created_by", "updated_by", "created_at", "updated_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 2, 2, NOW(), NOW())
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
            "scrap_percentage", "sort_order", "created_by", "updated_by", "created_at", "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, $6, 2, 2, NOW(), NOW())`,
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

      // Helper: get material id by sku code
      const getMaterialId = async (sku: string): Promise<number | null> => {
        const result = await queryRunner.query(
          `SELECT id FROM "inventory"."materials" WHERE "tenant_id" = $1 AND "sku" = $2 AND deleted_at IS NULL`,
          [tenantId, sku],
        );
        if (result.length === 0) {
          console.log(`  ⚠️  Material not found: ${sku}`);
          return null;
        }
        return result[0].id;
      };

      // Resolve all required material IDs by code
      const [
        silkInkId,
        silkChemId,
        subliInkId,
        subliPaperId,
        fabricId,
        labelId,
        fgSilkPrintId,
        fgSilkLabelId,
        fgSubliPrintId,
      ] = await Promise.all([
        getMaterialId('SILK-INK'),
        getMaterialId('SILK-CHEM'),
        getMaterialId('SUBLI-INK'),
        getMaterialId('SUBLI-PAPER'),
        getMaterialId('FABRIC'),
        getMaterialId('LABEL'),
        getMaterialId('FG-SILK-PRINT'),
        getMaterialId('FG-SILK-LABEL'),
        getMaterialId('FG-SUBLIMATION-PRINT'),
      ]);

      if (
        !silkInkId ||
        !silkChemId ||
        !subliInkId ||
        !subliPaperId ||
        !fabricId ||
        !labelId
      ) {
        console.log(
          '  ⚠️  Required raw materials not found. Please seed materials first.',
        );
        return;
      }

      if (!fgSilkPrintId || !fgSilkLabelId || !fgSubliPrintId) {
        console.log(
          '  ⚠️  Required finished goods not found. Please seed materials first.',
        );
        return;
      }

      // --- Silk Screen BOMs ---

      // 1. BOM-SILK-PRINT: Ink + Chemicals only
      await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: fgSilkPrintId,
          code: 'BOM-SILK-PRINT',
          name: 'Silk Screen Print Only',
          version: 'v1',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: silkInkId,
            quantity: 10,
            uom: 'ML',
            scrapPercentage: 3,
            sortOrder: 1,
          },
          {
            componentMaterialId: silkChemId,
            quantity: 2,
            uom: 'ML',
            scrapPercentage: 2,
            sortOrder: 2,
          },
        ],
      );

      // 2. BOM-SILK-LABEL-COMPANY: Ink + Chemicals + Company Label
      await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: fgSilkLabelId,
          code: 'BOM-SILK-LABEL-COMPANY',
          name: 'Silk Screen Print + Label (Company)',
          version: 'v1',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: silkInkId,
            quantity: 10,
            uom: 'ML',
            scrapPercentage: 3,
            sortOrder: 1,
          },
          {
            componentMaterialId: silkChemId,
            quantity: 2,
            uom: 'ML',
            scrapPercentage: 2,
            sortOrder: 2,
          },
          {
            componentMaterialId: labelId,
            quantity: 1,
            uom: 'PCS',
            scrapPercentage: 0,
            sortOrder: 3,
          },
        ],
      );

      // 3. BOM-SILK-LABEL-CUSTOMER: Ink + Chemicals only (customer provides label)
      await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: fgSilkLabelId,
          code: 'BOM-SILK-LABEL-CUSTOMER',
          name: 'Silk Screen Print + Label (Customer)',
          version: 'v1',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: silkInkId,
            quantity: 10,
            uom: 'ML',
            scrapPercentage: 3,
            sortOrder: 1,
          },
          {
            componentMaterialId: silkChemId,
            quantity: 2,
            uom: 'ML',
            scrapPercentage: 2,
            sortOrder: 2,
          },
        ],
      );

      // 4. BOM-SILK-FABRIC: Ink + Chemicals + Fabric (per meter)
      await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: fgSilkPrintId,
          code: 'BOM-SILK-FABRIC',
          name: 'Silk Screen Print on Fabric',
          version: 'v1',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: silkInkId,
            quantity: 10,
            uom: 'ML',
            scrapPercentage: 3,
            sortOrder: 1,
          },
          {
            componentMaterialId: silkChemId,
            quantity: 2,
            uom: 'ML',
            scrapPercentage: 2,
            sortOrder: 2,
          },
          {
            componentMaterialId: fabricId,
            quantity: 1,
            uom: 'MTR',
            scrapPercentage: 5,
            sortOrder: 3,
          },
        ],
      );

      // --- Sublimation BOMs ---

      // 5. BOM-SUBLIMATION-PRINT: Ink + Paper only
      await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: fgSubliPrintId,
          code: 'BOM-SUBLIMATION-PRINT',
          name: 'Sublimation Print Only',
          version: 'v1',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: subliInkId,
            quantity: 5,
            uom: 'ML',
            scrapPercentage: 3,
            sortOrder: 1,
          },
          {
            componentMaterialId: subliPaperId,
            quantity: 1,
            uom: 'SHEET',
            scrapPercentage: 2,
            sortOrder: 2,
          },
        ],
      );

      // 6. BOM-SUBLIMATION-FABRIC: Ink + Paper + Fabric (per meter)
      await createBom(
        queryRunner,
        {
          tenantId,
          parentMaterialId: fgSubliPrintId,
          code: 'BOM-SUBLIMATION-FABRIC',
          name: 'Sublimation Print on Fabric',
          version: 'v1',
          status: 'ACTIVE',
          effectiveDate: new Date(),
        },
        [
          {
            componentMaterialId: subliInkId,
            quantity: 5,
            uom: 'ML',
            scrapPercentage: 3,
            sortOrder: 1,
          },
          {
            componentMaterialId: subliPaperId,
            quantity: 1,
            uom: 'SHEET',
            scrapPercentage: 2,
            sortOrder: 2,
          },
          {
            componentMaterialId: fabricId,
            quantity: 1,
            uom: 'MTR',
            scrapPercentage: 5,
            sortOrder: 3,
          },
        ],
      );

      console.log('  ✅ Created 6 printing BOMs (silk screen + sublimation)');
    } catch (error) {
      console.error('  ❌ BOM seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
