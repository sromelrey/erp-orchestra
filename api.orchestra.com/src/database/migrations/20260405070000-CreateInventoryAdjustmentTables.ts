import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateInventoryAdjustmentTables20260405070000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create stock_adjustments table
    await queryRunner.createTable(
      new Table({
        name: 'stock_adjustments',
        schema: 'operations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tenant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'adjustment_number',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'adjustment_type',
            type: 'enum',
            enum: ['DAMAGE', 'LOSS', 'FOUND', 'COUNT'],
            isNullable: false,
          },
          {
            name: 'warehouse_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'location_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'reference_type',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'reference_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'adjustment_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'APPROVED', 'CANCELLED'],
            default: "'DRAFT'",
            isNullable: false,
          },
          {
            name: 'total_quantity',
            type: 'decimal',
            precision: 15,
            scale: 6,
            default: 0,
            isNullable: false,
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'approved_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'approved_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['tenant_id'],
            referencedSchema: 'system',
            referencedTableName: 'tenants',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['warehouse_id'],
            referencedSchema: 'operations',
            referencedTableName: 'warehouses',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['location_id'],
            referencedSchema: 'operations',
            referencedTableName: 'warehouse_locations',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['approved_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['created_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['updated_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['deleted_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // Create indexes for stock_adjustments
    await queryRunner.createIndex(
      'operations.stock_adjustments',
      new TableIndex({
        name: 'IDX_stock_adjustments_tenant_id',
        columnNames: ['tenant_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_adjustments',
      new TableIndex({
        name: 'IDX_stock_adjustments_warehouse_id',
        columnNames: ['warehouse_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_adjustments',
      new TableIndex({
        name: 'IDX_stock_adjustments_status',
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_adjustments',
      new TableIndex({
        name: 'IDX_stock_adjustments_date',
        columnNames: ['adjustment_date'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_adjustments',
      new TableIndex({
        name: 'IDX_stock_adjustments_tenant_warehouse',
        columnNames: ['tenant_id', 'warehouse_id'],
      }),
    );

    // Create stock_adjustment_items table
    await queryRunner.createTable(
      new Table({
        name: 'stock_adjustment_items',
        schema: 'operations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tenant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'stock_adjustment_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'item_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity_adjusted',
            type: 'decimal',
            precision: 15,
            scale: 6,
            isNullable: false,
          },
          {
            name: 'unit_cost',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'total_cost',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'batch_number',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'expiry_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['tenant_id'],
            referencedSchema: 'system',
            referencedTableName: 'tenants',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['stock_adjustment_id'],
            referencedSchema: 'operations',
            referencedTableName: 'stock_adjustments',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['item_id'],
            referencedSchema: 'operations',
            referencedTableName: 'materials',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['created_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['updated_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['deleted_by'],
            referencedSchema: 'system',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // Create indexes for stock_adjustment_items
    await queryRunner.createIndex(
      'operations.stock_adjustment_items',
      new TableIndex({
        name: 'IDX_stock_adj_items_adjustment_id',
        columnNames: ['stock_adjustment_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_adjustment_items',
      new TableIndex({
        name: 'IDX_stock_adj_items_item_id',
        columnNames: ['item_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_adjustment_items',
      new TableIndex({
        name: 'IDX_stock_adj_items_batch',
        columnNames: ['batch_number'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operations.stock_adjustment_items');
    await queryRunner.dropTable('operations.stock_adjustments');
  }
}
