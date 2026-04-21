import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds the service_config tables with sample printing service data.
 */
export const ServiceConfigSeeder: Seeder = {
  name: 'ServiceConfigSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    const tenantId = 1;

    try {
      console.log('🔧 Seeding Service Configuration data...');

      // First, seed Service Types
      const serviceTypes = [
        {
          code: 'SILK_SCREEN',
          name: 'Silk Screen Printing',
          description: 'Traditional silk screen printing method',
        },
        {
          code: 'SUBLIMATION',
          name: 'Sublimation Printing',
          description: 'Digital sublimation printing for fabric',
        },
      ];

      for (const serviceType of serviceTypes) {
        const existing = await queryRunner.query(
          `SELECT id FROM "service_config"."service_types" WHERE tenant_id = $1 AND code = $2`,
          [tenantId, serviceType.code],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "service_config"."service_types" (
              "tenant_id", "code", "name", "description", 
              "created_by", "updated_by", "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, 2, 2, NOW(), NOW())`,
            [
              tenantId,
              serviceType.code,
              serviceType.name,
              serviceType.description,
            ],
          );
          console.log(`  ✅ Created service type: ${serviceType.code}`);
        }
      }

      // Seed Service Options
      const serviceOptions = [
        {
          code: 'PRINT_ONLY',
          name: 'Print Only',
          description: 'Printing service only',
        },
        {
          code: 'PRINT_WITH_LABEL',
          name: 'Print + Label',
          description: 'Printing with label application',
        },
        {
          code: 'PRINT_WITH_FABRIC',
          name: 'Print + Fabric',
          description: 'Printing on fabric material',
        },
      ];

      for (const serviceOption of serviceOptions) {
        const existing = await queryRunner.query(
          `SELECT id FROM "service_config"."service_options" WHERE tenant_id = $1 AND code = $2`,
          [tenantId, serviceOption.code],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "service_config"."service_options" (
              "tenant_id", "code", "name", "description", 
              "created_by", "updated_by", "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, 2, 2, NOW(), NOW())`,
            [
              tenantId,
              serviceOption.code,
              serviceOption.name,
              serviceOption.description,
            ],
          );
          console.log(`  ✅ Created service option: ${serviceOption.code}`);
        }
      }

      // Seed Service Conditions
      const serviceConditions = [
        {
          code: 'LABEL_SOURCE',
          name: 'Label Source',
          values: ['CUSTOMER', 'COMPANY'],
        },
      ];

      for (const serviceCondition of serviceConditions) {
        const existing = await queryRunner.query(
          `SELECT id FROM "service_config"."service_conditions" WHERE tenant_id = $1 AND code = $2`,
          [tenantId, serviceCondition.code],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "service_config"."service_conditions" (
              "tenant_id", "code", "name", "values", 
              "created_by", "updated_by", "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, 2, 2, NOW(), NOW())`,
            [
              tenantId,
              serviceCondition.code,
              serviceCondition.name,
              JSON.stringify(serviceCondition.values),
            ],
          );
          console.log(
            `  ✅ Created service condition: ${serviceCondition.code}`,
          );
        }
      }

      // Get the IDs of seeded entities
      const serviceTypeIds = await queryRunner
        .query(
          `SELECT code, id FROM "service_config"."service_types" WHERE tenant_id = $1`,
          [tenantId],
        )
        .then((rows: any[]) =>
          Object.fromEntries(rows.map((r: any) => [r.code, r.id])),
        );

      const serviceOptionIds = await queryRunner
        .query(
          `SELECT code, id FROM "service_config"."service_options" WHERE tenant_id = $1`,
          [tenantId],
        )
        .then((rows: any[]) =>
          Object.fromEntries(rows.map((r: any) => [r.code, r.id])),
        );

      // Get BOM IDs by code
      const bomIds = await queryRunner
        .query(
          `SELECT code, id FROM "operations"."boms" WHERE tenant_id = $1`,
          [tenantId],
        )
        .then((rows: any[]) =>
          Object.fromEntries(rows.map((r: any) => [r.code, r.id])),
        );

      // Seed Service Configurations
      const serviceConfigurations = [
        {
          serviceTypeCode: 'SILK_SCREEN',
          serviceOptionCode: 'PRINT_ONLY',
          bomCode: 'BOM-SILK-PRINT',
          price: 10.0,
        },
        {
          serviceTypeCode: 'SILK_SCREEN',
          serviceOptionCode: 'PRINT_WITH_LABEL',
          conditionKey: 'LABEL_SOURCE',
          conditionValue: 'CUSTOMER',
          bomCode: 'BOM-SILK-PRINT',
          price: 15.0,
        },
        {
          serviceTypeCode: 'SILK_SCREEN',
          serviceOptionCode: 'PRINT_WITH_LABEL',
          conditionKey: 'LABEL_SOURCE',
          conditionValue: 'COMPANY',
          bomCode: 'BOM-SILK-LABEL-COMPANY',
          price: 18.0,
        },
        {
          serviceTypeCode: 'SILK_SCREEN',
          serviceOptionCode: 'PRINT_WITH_FABRIC',
          bomCode: 'BOM-SILK-FABRIC',
          price: 25.0,
        },
        {
          serviceTypeCode: 'SUBLIMATION',
          serviceOptionCode: 'PRINT_ONLY',
          bomCode: 'BOM-SUBLIMATION-PRINT',
          price: 12.0,
        },
        {
          serviceTypeCode: 'SUBLIMATION',
          serviceOptionCode: 'PRINT_WITH_FABRIC',
          bomCode: 'BOM-SUBLIMATION-FABRIC',
          price: 30.0,
        },
      ];

      for (const config of serviceConfigurations) {
        const existing = await queryRunner.query(
          `SELECT id FROM "service_config"."service_configurations" 
           WHERE tenant_id = $1 
           AND service_type_id = $2 
           AND service_option_id = $3 
           AND COALESCE(condition_key, '') = $4 
           AND COALESCE(condition_value, '') = $5`,
          [
            tenantId,
            serviceTypeIds[config.serviceTypeCode],
            serviceOptionIds[config.serviceOptionCode],
            config.conditionKey || '',
            config.conditionValue || '',
          ],
        );

        if (existing.length === 0) {
          await queryRunner.query(
            `INSERT INTO "service_config"."service_configurations" (
              "tenant_id", "service_type_id", "service_option_id", 
              "condition_key", "condition_value", "bom_id", "price", 
              "created_by", "updated_by", "created_at", "updated_at"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 2, 2, NOW(), NOW())`,
            [
              tenantId,
              serviceTypeIds[config.serviceTypeCode],
              serviceOptionIds[config.serviceOptionCode],
              config.conditionKey || null,
              config.conditionValue || null,
              bomIds[config.bomCode] || null,
              config.price,
            ],
          );
          console.log(
            `  ✅ Created configuration: ${config.serviceTypeCode} + ${config.serviceOptionCode}` +
              (config.conditionKey
                ? ` (${config.conditionKey}=${config.conditionValue})`
                : ''),
          );
        }
      }

      console.log('✅ Service Configuration seeding completed successfully!');
    } finally {
      await queryRunner.release();
    }
  },
};
