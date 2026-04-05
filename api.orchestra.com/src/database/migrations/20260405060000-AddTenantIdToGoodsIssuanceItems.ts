import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToGoodsIssuanceItems20260405060000 implements MigrationInterface {
  name = 'AddTenantIdToGoodsIssuanceItems20260405060000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add tenant_id column to goods_issuance_items
    await queryRunner.query(`
      ALTER TABLE "operations"."goods_issuance_items" 
      ADD COLUMN "tenant_id" integer NOT NULL DEFAULT 1
    `);

    // Add foreign key constraint for tenant_id
    await queryRunner.query(`
      ALTER TABLE "operations"."goods_issuance_items" 
      ADD CONSTRAINT "fk_goods_issuance_items_tenant" 
      FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Add index for tenant_id
    await queryRunner.query(`
      CREATE INDEX "idx_goods_issuance_items_tenant_id" 
      ON "operations"."goods_issuance_items" ("tenant_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX "idx_goods_issuance_items_tenant_id"
    `);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "operations"."goods_issuance_items" 
      DROP CONSTRAINT "fk_goods_issuance_items_tenant"
    `);

    // Drop column
    await queryRunner.query(`
      ALTER TABLE "operations"."goods_issuance_items" 
      DROP COLUMN "tenant_id"
    `);
  }
}
