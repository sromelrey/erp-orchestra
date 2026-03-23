import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixBomCostingColumns20260323170000 implements MigrationInterface {
  name = 'FixBomCostingColumns20260323170000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add audit columns to bom_costings table if they don't exist
    await queryRunner.query(`
      ALTER TABLE operations.bom_costings 
      ADD COLUMN IF NOT EXISTS created_by INT NULL,
      ADD COLUMN IF NOT EXISTS updated_by INT NULL,
      ADD COLUMN IF NOT EXISTS deleted_by INT NULL
    `);

    // Add audit columns to bom_costing_components table if they don't exist
    await queryRunner.query(`
      ALTER TABLE operations.bom_costing_components 
      ADD COLUMN IF NOT EXISTS created_by INT NULL,
      ADD COLUMN IF NOT EXISTS updated_by INT NULL,
      ADD COLUMN IF NOT EXISTS deleted_by INT NULL
    `);

    // Add audit columns to bom_costing_history table if they don't exist
    await queryRunner.query(`
      ALTER TABLE operations.bom_costing_history 
      ADD COLUMN IF NOT EXISTS created_by INT NULL,
      ADD COLUMN IF NOT EXISTS updated_by INT NULL,
      ADD COLUMN IF NOT EXISTS deleted_by INT NULL
    `);

    // Add previousValues column to bom_costing_history table if it doesn't exist
    await queryRunner.query(`
      ALTER TABLE operations.bom_costing_history 
      ADD COLUMN IF NOT EXISTS "previousValues" JSONB NULL
    `);

    // Add foreign key constraints for created_by columns
    // Note: PostgreSQL doesn't support IF NOT EXISTS for constraints, so we need to check first
    const bomCostingsCreatedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costings' 
        AND constraint_name = 'fk_bom_costings_created_by'
    `);

    if (bomCostingsCreatedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costings 
        ADD CONSTRAINT fk_bom_costings_created_by 
        FOREIGN KEY (created_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    const bomCostingComponentsCreatedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costing_components' 
        AND constraint_name = 'fk_bom_costing_components_created_by'
    `);

    if (bomCostingComponentsCreatedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costing_components 
        ADD CONSTRAINT fk_bom_costing_components_created_by 
        FOREIGN KEY (created_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    const bomCostingHistoryCreatedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costing_history' 
        AND constraint_name = 'fk_bom_costing_history_created_by'
    `);

    if (bomCostingHistoryCreatedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costing_history 
        ADD CONSTRAINT fk_bom_costing_history_created_by 
        FOREIGN KEY (created_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    // Add foreign key constraints for updated_by columns
    const bomCostingsUpdatedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costings' 
        AND constraint_name = 'fk_bom_costings_updated_by'
    `);

    if (bomCostingsUpdatedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costings 
        ADD CONSTRAINT fk_bom_costings_updated_by 
        FOREIGN KEY (updated_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    const bomCostingComponentsUpdatedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costing_components' 
        AND constraint_name = 'fk_bom_costing_components_updated_by'
    `);

    if (bomCostingComponentsUpdatedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costing_components 
        ADD CONSTRAINT fk_bom_costing_components_updated_by 
        FOREIGN KEY (updated_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    const bomCostingHistoryUpdatedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costing_history' 
        AND constraint_name = 'fk_bom_costing_history_updated_by'
    `);

    if (bomCostingHistoryUpdatedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costing_history 
        ADD CONSTRAINT fk_bom_costing_history_updated_by 
        FOREIGN KEY (updated_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    // Add foreign key constraints for deleted_by columns
    const bomCostingsDeletedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costings' 
        AND constraint_name = 'fk_bom_costings_deleted_by'
    `);

    if (bomCostingsDeletedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costings 
        ADD CONSTRAINT fk_bom_costings_deleted_by 
        FOREIGN KEY (deleted_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    const bomCostingComponentsDeletedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costing_components' 
        AND constraint_name = 'fk_bom_costing_components_deleted_by'
    `);

    if (bomCostingComponentsDeletedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costing_components 
        ADD CONSTRAINT fk_bom_costing_components_deleted_by 
        FOREIGN KEY (deleted_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }

    const bomCostingHistoryDeletedByKeyExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'operations' 
        AND table_name = 'bom_costing_history' 
        AND constraint_name = 'fk_bom_costing_history_deleted_by'
    `);

    if (bomCostingHistoryDeletedByKeyExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE operations.bom_costing_history 
        ADD CONSTRAINT fk_bom_costing_history_deleted_by 
        FOREIGN KEY (deleted_by) REFERENCES system.users(id) ON DELETE SET NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE operations.bom_costings DROP CONSTRAINT IF EXISTS fk_bom_costings_created_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costings DROP CONSTRAINT IF EXISTS fk_bom_costings_updated_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costings DROP CONSTRAINT IF EXISTS fk_bom_costings_deleted_by`,
    );

    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_components DROP CONSTRAINT IF EXISTS fk_bom_costing_components_created_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_components DROP CONSTRAINT IF EXISTS fk_bom_costing_components_updated_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_components DROP CONSTRAINT IF EXISTS fk_bom_costing_components_deleted_by`,
    );

    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_history DROP CONSTRAINT IF EXISTS fk_bom_costing_history_created_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_history DROP CONSTRAINT IF EXISTS fk_bom_costing_history_updated_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_history DROP CONSTRAINT IF EXISTS fk_bom_costing_history_deleted_by`,
    );

    // Drop columns
    await queryRunner.query(
      `ALTER TABLE operations.bom_costings DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_components DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_by`,
    );
    await queryRunner.query(
      `ALTER TABLE operations.bom_costing_history DROP COLUMN IF EXISTS created_by, DROP COLUMN IF EXISTS updated_by, DROP COLUMN IF EXISTS deleted_by, DROP COLUMN IF EXISTS "previousValues"`,
    );
  }
}
