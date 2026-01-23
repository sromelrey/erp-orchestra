import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCodeAndStatusToRole1737646500000 implements MigrationInterface {
  name = 'AddCodeAndStatusToRole1737646500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'system.roles',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '50',
        isUnique: true,
      }),
    );
    await queryRunner.addColumn(
      'system.roles',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '20',
        default: "'ACTIVE'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('system.roles', 'status');
    await queryRunner.dropColumn('system.roles', 'code');
  }
}
