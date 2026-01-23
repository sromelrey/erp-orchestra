import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddCommonEntityColumns1642857123 implements MigrationInterface {
  name = 'AddCommonEntityColumns1642857123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add common entity columns to operations tables
    const tables = [
      'operations.boms',
      'operations.bom_items',
      'operations.materials',
    ];

    for (const tableName of tables) {
      // Check if table exists
      const tableExists = await queryRunner.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'operations' 
          AND table_name = '${tableName.replace('operations.', '')}'
        )`,
      );

      if (tableExists[0].exists) {
        console.log(`Adding columns to ${tableName}...`);

        await queryRunner.addColumn(
          tableName,
          new TableColumn({
            name: 'created_by',
            type: 'int',
            isNullable: true,
          }),
        );

        await queryRunner.addColumn(
          tableName,
          new TableColumn({
            name: 'updated_by',
            type: 'int',
            isNullable: true,
          }),
        );

        await queryRunner.addColumn(
          tableName,
          new TableColumn({
            name: 'deleted_by',
            type: 'int',
            isNullable: true,
          }),
        );

        await queryRunner.addColumn(
          tableName,
          new TableColumn({
            name: 'deleted_at',
            type: 'timestamp without time zone',
            isNullable: true,
          }),
        );

        console.log(`✅ Added columns to ${tableName}`);
      } else {
        console.log(`⚠️  Table ${tableName} does not exist, skipping...`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns from operations tables
    const tables = [
      'operations.boms',
      'operations.bom_items',
      'operations.materials',
    ];

    for (const tableName of tables) {
      try {
        await queryRunner.dropColumn(tableName, 'created_by');
        await queryRunner.dropColumn(tableName, 'updated_by');
        await queryRunner.dropColumn(tableName, 'deleted_by');
        await queryRunner.dropColumn(tableName, 'deleted_at');
        console.log(`✅ Removed columns from ${tableName}`);
      } catch (error) {
        console.log(
          `⚠️  Columns may not exist in ${tableName}: ${error.message}`,
        );
      }
    }
  }
}
