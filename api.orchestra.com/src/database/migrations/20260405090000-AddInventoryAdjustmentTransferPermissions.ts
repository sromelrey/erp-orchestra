import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryAdjustmentTransferPermissions20260405090000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add the missing columns if they don't exist
    await queryRunner.query(`
      ALTER TABLE system.permissions 
      ADD COLUMN IF NOT EXISTS module varchar(50),
      ADD COLUMN IF NOT EXISTS action varchar(50),
      ADD COLUMN IF NOT EXISTS resource varchar(50)
    `);

    // Create unique constraint on (module, action, resource) if it doesn't exist
    // PostgreSQL doesn't support IF NOT EXISTS for constraints, so we need to check manually
    const constraintExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'UQ_permissions_module_action_resource'
        AND table_schema = 'system'
        AND table_name = 'permissions'
      )
    `);

    if (!constraintExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE system.permissions 
        ADD CONSTRAINT "UQ_permissions_module_action_resource" 
        UNIQUE (module, action, resource)
      `);
    }

    // Insert inventory adjustment permissions - using only columns that exist
    await queryRunner.query(`
      INSERT INTO system.permissions (name, description, module, action, resource, slug, created_at, updated_at)
      VALUES 
        ('Create Stock Adjustments', 'Create stock adjustments', 'INVENTORY', 'CREATE', 'ADJUSTMENT', 'inventory-create-adjustment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Read Stock Adjustments', 'Read stock adjustments', 'INVENTORY', 'READ', 'ADJUSTMENT', 'inventory-read-adjustment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Edit Stock Adjustments', 'Edit stock adjustments', 'INVENTORY', 'EDIT', 'ADJUSTMENT', 'inventory-edit-adjustment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Approve Stock Adjustments', 'Approve stock adjustments', 'INVENTORY', 'APPROVE', 'ADJUSTMENT', 'inventory-approve-adjustment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Cancel Stock Adjustments', 'Cancel stock adjustments', 'INVENTORY', 'CANCEL', 'ADJUSTMENT', 'inventory-cancel-adjustment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Delete Stock Adjustments', 'Delete stock adjustments', 'INVENTORY', 'DELETE', 'ADJUSTMENT', 'inventory-delete-adjustment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Create Stock Transfers', 'Create stock transfers', 'INVENTORY', 'CREATE', 'TRANSFER', 'inventory-create-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Read Stock Transfers', 'Read stock transfers', 'INVENTORY', 'READ', 'TRANSFER', 'inventory-read-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Edit Stock Transfers', 'Edit stock transfers', 'INVENTORY', 'EDIT', 'TRANSFER', 'inventory-edit-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Approve Stock Transfers', 'Approve stock transfers', 'INVENTORY', 'APPROVE', 'TRANSFER', 'inventory-approve-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Ship Stock Transfers', 'Ship stock transfers', 'INVENTORY', 'SHIP', 'TRANSFER', 'inventory-ship-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Receive Stock Transfers', 'Receive stock transfers', 'INVENTORY', 'RECEIVE', 'TRANSFER', 'inventory-receive-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Cancel Stock Transfers', 'Cancel stock transfers', 'INVENTORY', 'CANCEL', 'TRANSFER', 'inventory-cancel-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('Delete Stock Transfers', 'Delete stock transfers', 'INVENTORY', 'DELETE', 'TRANSFER', 'inventory-delete-transfer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (module, action, resource) DO NOTHING;
    `);

    // Get admin role ID
    const adminRoleResult = await queryRunner.query(`
      SELECT id FROM system.roles 
      WHERE name = 'ADMIN' 
      AND deleted_at IS NULL 
      LIMIT 1
    `);

    if (adminRoleResult.length > 0) {
      const adminRoleId = adminRoleResult[0].id;

      // Get all inventory adjustment and transfer permission IDs
      const permissionsResult = await queryRunner.query(`
        SELECT id FROM system.permissions 
        WHERE module = 'INVENTORY' 
        AND resource IN ('ADJUSTMENT', 'TRANSFER')
        AND deleted_at IS NULL
      `);

      if (permissionsResult.length > 0) {
        // Insert role permissions for admin
        const values = permissionsResult
          .map((p) => `(${adminRoleId}, ${p.id})`)
          .join(', ');

        await queryRunner.query(`
          INSERT INTO system.role_permissions (role_id, permission_id, created_at, updated_at)
          VALUES ${values}
          ON CONFLICT (role_id, permission_id) DO NOTHING;
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete role permissions
    await queryRunner.query(`
      DELETE FROM system.role_permissions 
      WHERE permission_id IN (
        SELECT id FROM system.permissions 
        WHERE module = 'INVENTORY' 
        AND resource IN ('ADJUSTMENT', 'TRANSFER')
      );
    `);

    // Delete permissions
    await queryRunner.query(`
      DELETE FROM system.permissions 
      WHERE module = 'INVENTORY' 
      AND resource IN ('ADJUSTMENT', 'TRANSFER');
    `);
  }
}
