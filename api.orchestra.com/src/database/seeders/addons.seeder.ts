import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

export const AddonsSeeder: Seeder = {
  name: 'AddonsSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('📦 Running: AddonsSeeder');

      const tenantId = 1;

      // Check if add-ons already exist
      const existingAddons = await queryRunner.query(
        `SELECT COUNT(*) as count FROM "addons" WHERE "tenant_id" = $1`,
        [tenantId],
      );

      if (existingAddons[0].count > 0) {
        console.log('  ⏭️  Add-ons already exist, skipping...');
        await queryRunner.commitTransaction();
        return;
      }

      // Insert Physical Add-ons
      const physicalAddons = [
        {
          code: 'ETEKITA',
          name: 'Etekita',
          description: 'Neck label with etekita material',
          type: 'PHYSICAL',
          basePrice: 2.5,
          materialId: null, // Will be updated if material exists
        },
        {
          code: 'INNER_LABEL',
          name: 'Inner Label',
          description: 'Label inside the garment',
          type: 'PHYSICAL',
          basePrice: 1.5,
          materialId: null,
        },
        {
          code: 'HANGTAG',
          name: 'Hangtag',
          description: 'Brand hangtag for garment',
          type: 'PHYSICAL',
          basePrice: 0.75,
          materialId: null,
        },
        {
          code: 'SIZE_LABEL',
          name: 'Size Label',
          description: 'Size label on garment',
          type: 'PHYSICAL',
          basePrice: 0.5,
          materialId: null,
        },
        {
          code: 'HEM_TAG',
          name: 'Hem Tag',
          description: 'Tag at the hem of garment',
          type: 'PHYSICAL',
          basePrice: 1.0,
          materialId: null,
        },
        {
          code: 'PATCH_NECK',
          name: 'Patch Neck',
          description: 'Patch on neck area',
          type: 'PHYSICAL',
          basePrice: 3.0,
          materialId: null,
        },
        {
          code: 'SLEEVE_TAG',
          name: 'Sleeve Tag',
          description: 'Tag on sleeve',
          type: 'PHYSICAL',
          basePrice: 0.8,
          materialId: null,
        },
      ];

      // Insert Service Add-ons
      const serviceAddons = [
        {
          code: 'VIP_HANDLING',
          name: 'VIP Handling',
          description: 'Priority processing for VIP customers',
          type: 'SERVICE',
          basePrice: 10.0,
          materialId: null,
        },
        {
          code: 'EXPRESS_PROCESSING',
          name: 'Express Processing',
          description: 'Fast track processing service',
          type: 'SERVICE',
          basePrice: 15.0,
          materialId: null,
        },
        {
          code: 'SPECIAL_PACKAGING',
          name: 'Special Packaging',
          description: 'Premium packaging service',
          type: 'SERVICE',
          basePrice: 5.0,
          materialId: null,
        },
      ];

      const allAddons = [...physicalAddons, ...serviceAddons];
      const addonIds: Record<string, number> = {};

      // Insert add-ons
      for (const addon of allAddons) {
        const result = await queryRunner.query(
          `INSERT INTO "addons" (
            "tenant_id", "code", "name", "description", "type", 
            "base_price", "material_id", "is_active", 
            "created_by", "updated_by", "created_at", "updated_at"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 2, 2, NOW(), NOW())
          RETURNING id`,
          [
            tenantId,
            addon.code,
            addon.name,
            addon.description,
            addon.type,
            addon.basePrice,
            addon.materialId,
            true,
          ],
        );

        addonIds[addon.code] = result[0].id;
        console.log(`  ✅ Created add-on: ${addon.name} (${addon.code})`);
      }

      // Insert Inclusion Rules
      const inclusionRules = [
        // Physical add-on rules
        {
          addonCode: 'INNER_LABEL',
          ruleType: 'MIN_QTY',
          thresholdValue: 40,
          discountPercent: 100, // Free if quantity >= 40
        },
        {
          addonCode: 'HANGTAG',
          ruleType: 'MIN_QTY',
          thresholdValue: 100,
          discountPercent: 100, // Free if quantity >= 100
        },
        {
          addonCode: 'SIZE_LABEL',
          ruleType: 'MIN_QTY',
          thresholdValue: 50,
          discountPercent: 100, // Free if quantity >= 50
        },
        {
          addonCode: 'HEM_TAG',
          ruleType: 'MIN_QTY',
          thresholdValue: 30,
          discountPercent: 100, // Free if quantity >= 30
        },
        // Service add-on rules
        {
          addonCode: 'VIP_HANDLING',
          ruleType: 'MIN_QTY',
          thresholdValue: 50,
          discountPercent: 50, // 50% off if quantity >= 50
        },
        {
          addonCode: 'EXPRESS_PROCESSING',
          ruleType: 'MIN_QTY',
          thresholdValue: 25,
          discountPercent: 25, // 25% off if quantity >= 25
        },
      ];

      for (const rule of inclusionRules) {
        const addonId = addonIds[rule.addonCode];
        if (addonId) {
          await queryRunner.query(
            `INSERT INTO "addon_inclusion_rules" (
              "tenant_id", "addon_id", "rule_type", "threshold_value", 
              "discount_percent", "is_active", "created_by", "updated_by", 
              "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, $6, 2, 2, NOW(), NOW())`,
            [
              tenantId,
              addonId,
              rule.ruleType,
              rule.thresholdValue,
              rule.discountPercent,
              true,
            ],
          );

          const discountText =
            rule.discountPercent === 100
              ? 'FREE'
              : `${rule.discountPercent}% off`;
          console.log(
            `  ✅ Created rule: ${rule.addonCode} - ${discountText} if qty >= ${rule.thresholdValue}`,
          );
        }
      }

      console.log('✅ Add-ons seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error seeding add-ons:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
};
