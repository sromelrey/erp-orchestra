import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAddonRulesTypeEnum20260421100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old check constraint
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      DROP CONSTRAINT IF EXISTS "CHK_addon_rules_type"
    `);

    // Drop the default value
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ALTER COLUMN "rule_type" DROP DEFAULT
    `);

    // Create enum type for rule_type
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE addon_rule_type_enum AS ENUM ('MIN_QTY', 'QUANTITY_THRESHOLD', 'ORDER_TOTAL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    // Alter column to use the enum type
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ALTER COLUMN "rule_type" TYPE addon_rule_type_enum 
      USING "rule_type"::addon_rule_type_enum
    `);

    // Add the default value back
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ALTER COLUMN "rule_type" SET DEFAULT 'MIN_QTY'::addon_rule_type_enum
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the default value
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ALTER COLUMN "rule_type" DROP DEFAULT
    `);

    // Revert to varchar with check constraint
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ALTER COLUMN "rule_type" TYPE varchar(20)
    `);

    // Add back the old check constraint
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ADD CONSTRAINT "CHK_addon_rules_type" 
      CHECK ("rule_type" = 'MIN_QTY')
    `);

    // Add the default value back
    await queryRunner.query(`
      ALTER TABLE "addon_inclusion_rules" 
      ALTER COLUMN "rule_type" SET DEFAULT 'MIN_QTY'
    `);

    // Drop the enum type
    await queryRunner.query(`
      DROP TYPE IF EXISTS addon_rule_type_enum
    `);
  }
}
