import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePayslips1774000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'hris.payslips',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'pay_period_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'employee_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'CALCULATED', 'PUBLISHED'],
            default: `'DRAFT'`,
          },
          {
            name: 'gross_pay',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_deductions',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'net_pay',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'meta',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'pdf_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'hris.payslip_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'payslip_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['EARNING', 'DEDUCTION'],
          },
          {
            name: 'code',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'label',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'meta',
            type: 'jsonb',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'hris.payslips',
      new TableIndex({
        name: 'IDX_payslips_tenant_period_employee',
        columnNames: ['tenant_id', 'pay_period_id', 'employee_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKeys('hris.payslips', [
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'system.tenants',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['pay_period_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'hris.pay_periods',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'hris.employees',
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createForeignKeys('hris.payslip_items', [
      new TableForeignKey({
        columnNames: ['payslip_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'hris.payslips',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('hris.payslip_items');
    await queryRunner.dropTable('hris.payslips');
  }
}
