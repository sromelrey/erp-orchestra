import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateInventoryTransferTables20260405080000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create stock_transfers table
    await queryRunner.createTable(
      new Table({
        name: 'stock_transfers',
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
            name: 'transfer_number',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'source_warehouse_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'source_location_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'destination_warehouse_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'destination_location_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'transfer_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'expected_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'PENDING',
              'APPROVED',
              'IN_TRANSIT',
              'RECEIVED',
              'CANCELLED',
            ],
            default: "'PENDING'",
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
            name: 'shipped_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'received_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'received_by',
            type: 'int',
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
            columnNames: ['source_warehouse_id'],
            referencedSchema: 'operations',
            referencedTableName: 'warehouses',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['source_location_id'],
            referencedSchema: 'operations',
            referencedTableName: 'warehouse_locations',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['destination_warehouse_id'],
            referencedSchema: 'operations',
            referencedTableName: 'warehouses',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['destination_location_id'],
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
            columnNames: ['received_by'],
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

    // Create indexes for stock_transfers
    await queryRunner.createIndex(
      'operations.stock_transfers',
      new TableIndex({
        name: 'IDX_stock_transfers_tenant_id',
        columnNames: ['tenant_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_transfers',
      new TableIndex({
        name: 'IDX_stock_transfers_source_warehouse',
        columnNames: ['source_warehouse_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_transfers',
      new TableIndex({
        name: 'IDX_stock_transfers_dest_warehouse',
        columnNames: ['destination_warehouse_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_transfers',
      new TableIndex({
        name: 'IDX_stock_transfers_status',
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_transfers',
      new TableIndex({
        name: 'IDX_stock_transfers_date',
        columnNames: ['transfer_date'],
      }),
    );

    // Create stock_transfer_items table
    await queryRunner.createTable(
      new Table({
        name: 'stock_transfer_items',
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
            name: 'stock_transfer_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'item_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity_transferred',
            type: 'decimal',
            precision: 15,
            scale: 6,
            isNullable: false,
          },
          {
            name: 'quantity_received',
            type: 'decimal',
            precision: 15,
            scale: 6,
            default: 0,
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
            columnNames: ['stock_transfer_id'],
            referencedSchema: 'operations',
            referencedTableName: 'stock_transfers',
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

    // Create indexes for stock_transfer_items
    await queryRunner.createIndex(
      'operations.stock_transfer_items',
      new TableIndex({
        name: 'IDX_stock_transfer_items_transfer_id',
        columnNames: ['stock_transfer_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_transfer_items',
      new TableIndex({
        name: 'IDX_stock_transfer_items_item_id',
        columnNames: ['item_id'],
      }),
    );
    await queryRunner.createIndex(
      'operations.stock_transfer_items',
      new TableIndex({
        name: 'IDX_stock_transfer_items_batch',
        columnNames: ['batch_number'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operations.stock_transfer_items');
    await queryRunner.dropTable('operations.stock_transfers');
  }
}
