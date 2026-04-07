import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveInventoryMasterDataToInventorySchema2026040601000 implements MigrationInterface {
  name = 'MoveInventoryMasterDataToInventorySchema2026040601000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Move items table
    await queryRunner.query(
      `ALTER TABLE "operations"."items" SET SCHEMA "inventory"`,
    );

    // Move item_categories table
    await queryRunner.query(
      `ALTER TABLE "operations"."item_categories" SET SCHEMA "inventory"`,
    );

    // Move units_of_measure table
    await queryRunner.query(
      `ALTER TABLE "operations"."units_of_measure" SET SCHEMA "inventory"`,
    );

    // Move warehouses table
    await queryRunner.query(
      `ALTER TABLE "operations"."warehouses" SET SCHEMA "inventory"`,
    );

    // Move warehouse_locations table
    await queryRunner.query(
      `ALTER TABLE "operations"."warehouse_locations" SET SCHEMA "inventory"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Move tables back to operations schema
    await queryRunner.query(
      `ALTER TABLE "inventory"."items" SET SCHEMA "operations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."item_categories" SET SCHEMA "operations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."units_of_measure" SET SCHEMA "operations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouses" SET SCHEMA "operations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory"."warehouse_locations" SET SCHEMA "operations"`,
    );
  }
}
