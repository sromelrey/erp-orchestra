import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds the permissions table with standard system permissions.
 */
export const PermissionsSeeder: Seeder = {
  name: 'PermissionsSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      const permissions = [
        // HRIS - Employee
        {
          module: 'hris',
          resource: 'employee',
          action: 'view',
          slug: 'hris.employee.view',
          name: 'View Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'create',
          slug: 'hris.employee.create',
          name: 'Create Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'update',
          slug: 'hris.employee.update',
          name: 'Update Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'delete',
          slug: 'hris.employee.delete',
          name: 'Delete Employees',
        },
        {
          module: 'hris',
          resource: 'employee',
          action: 'manage',
          slug: 'hris.employee.manage',
          name: 'Manage Employees',
        },
        // HRIS - Attendance
        {
          module: 'hris',
          resource: 'attendance',
          action: 'log',
          slug: 'hris.attendance.log',
          name: 'Log Attendance',
        },
        {
          module: 'hris',
          resource: 'attendance',
          action: 'view',
          slug: 'hris.attendance.view',
          name: 'View Attendance',
        },
        // HRIS - Leave
        {
          module: 'hris',
          resource: 'leave',
          action: 'request',
          slug: 'hris.leave.request',
          name: 'Request Leave',
        },
        {
          module: 'hris',
          resource: 'leave',
          action: 'manage',
          slug: 'hris.leave.manage',
          name: 'Manage Leaves',
        },
        // HRIS - Leave Type
        {
          module: 'hris',
          resource: 'leave_type',
          action: 'manage',
          slug: 'hris.leave_type.manage',
          name: 'Manage Leave Types',
        },
        // HRIS - Branch
        {
          module: 'hris',
          resource: 'branch',
          action: 'view',
          slug: 'hris.branch.view',
          name: 'View Branches',
        },
        {
          module: 'hris',
          resource: 'branch',
          action: 'manage',
          slug: 'hris.branch.manage',
          name: 'Manage Branches',
        },
        // HRIS - Department
        {
          module: 'hris',
          resource: 'department',
          action: 'view',
          slug: 'hris.department.view',
          name: 'View Departments',
        },
        {
          module: 'hris',
          resource: 'department',
          action: 'manage',
          slug: 'hris.department.manage',
          name: 'Manage Departments',
        },
        // HRIS - Designation
        {
          module: 'hris',
          resource: 'designation',
          action: 'view',
          slug: 'hris.designation.view',
          name: 'View Designations',
        },
        {
          module: 'hris',
          resource: 'designation',
          action: 'manage',
          slug: 'hris.designation.manage',
          name: 'Manage Designations',
        },
        // HRIS - Payroll (Pay Periods)
        {
          module: 'hris',
          resource: 'payroll',
          action: 'view',
          slug: 'hris.payroll.view',
          name: 'View Pay Periods',
        },
        {
          module: 'hris',
          resource: 'payroll',
          action: 'manage',
          slug: 'hris.payroll.manage',
          name: 'Manage Pay Periods',
        },
        // HRIS - Timesheet
        {
          module: 'hris',
          resource: 'timesheet',
          action: 'view',
          slug: 'hris.timesheet.view',
          name: 'View Timesheets',
        },
        {
          module: 'hris',
          resource: 'timesheet',
          action: 'manage',
          slug: 'hris.timesheet.manage',
          name: 'Manage Timesheets',
        },
        // HRIS - Imports/Exports
        {
          module: 'hris',
          resource: 'import',
          action: 'manage',
          slug: 'hris.import.manage',
          name: 'Manage HRIS Imports',
        },
        {
          module: 'hris',
          resource: 'export',
          action: 'manage',
          slug: 'hris.export.manage',
          name: 'Manage HRIS Exports',
        },
        // Operations - Item Master
        {
          module: 'operations',
          resource: 'item',
          action: 'view',
          slug: 'operations.item.view',
          name: 'View Items',
        },
        {
          module: 'operations',
          resource: 'item',
          action: 'manage',
          slug: 'operations.item.manage',
          name: 'Manage Items',
        },
        // Operations - Materials
        {
          module: 'operations',
          resource: 'materials',
          action: 'view',
          slug: 'operations.materials.view',
          name: 'View Materials',
        },
        {
          module: 'operations',
          resource: 'materials',
          action: 'create',
          slug: 'operations.materials.create',
          name: 'Create Materials',
        },
        {
          module: 'operations',
          resource: 'materials',
          action: 'update',
          slug: 'operations.materials.update',
          name: 'Update Materials',
        },
        {
          module: 'operations',
          resource: 'materials',
          action: 'delete',
          slug: 'operations.materials.delete',
          name: 'Delete Materials',
        },
        {
          module: 'operations',
          resource: 'materials',
          action: 'manage',
          slug: 'operations.materials.manage',
          name: 'Manage Materials',
        },
        {
          module: 'operations',
          resource: 'materials',
          action: 'import',
          slug: 'operations.materials.import',
          name: 'Import Materials',
        },
        {
          module: 'operations',
          resource: 'materials',
          action: 'export',
          slug: 'operations.materials.export',
          name: 'Export Materials',
        },
        {
          module: 'operations',
          resource: 'category',
          action: 'manage',
          slug: 'operations.category.manage',
          name: 'Manage Item Categories',
        },
        {
          module: 'operations',
          resource: 'uom',
          action: 'manage',
          slug: 'operations.uom.manage',
          name: 'Manage Units of Measure',
        },
        // Operations - Warehouses & Stock
        {
          module: 'operations',
          resource: 'warehouse',
          action: 'manage',
          slug: 'operations.warehouse.manage',
          name: 'Manage Warehouses & Locations',
        },
        {
          module: 'operations',
          resource: 'stock',
          action: 'manage',
          slug: 'operations.stock.manage',
          name: 'Manage Stock Movements',
        },
        {
          module: 'operations',
          resource: 'bom_costing',
          action: 'view',
          slug: 'operations.bom_costing.view',
          name: 'View BOM Costings',
        },
        {
          module: 'operations',
          resource: 'bom_costing',
          action: 'manage',
          slug: 'operations.bom_costing.manage',
          name: 'Manage BOM Costings',
        },
        {
          module: 'operations',
          resource: 'bom_costing_history',
          action: 'view',
          slug: 'operations.bom_costing_history.view',
          name: 'View BOM Costing History',
        },
        {
          module: 'operations',
          resource: 'bom_costing',
          action: 'calculate',
          slug: 'operations.bom_costing.calculate',
          name: 'Calculate BOM Costings',
        },
        {
          module: 'operations',
          resource: 'stock',
          action: 'view',
          slug: 'operations.stock.view',
          name: 'View Stock Ledger',
        },
        // Operations - Goods Receipt
        {
          module: 'operations',
          resource: 'goods-receipt',
          action: 'create',
          slug: 'goods-receipt.create',
          name: 'Create Goods Receipt',
        },
        {
          module: 'operations',
          resource: 'goods-receipt',
          action: 'view',
          slug: 'goods-receipt.view',
          name: 'View Goods Receipt',
        },
        {
          module: 'operations',
          resource: 'goods-receipt',
          action: 'update',
          slug: 'goods-receipt.update',
          name: 'Update Goods Receipt',
        },
        {
          module: 'operations',
          resource: 'goods-receipt',
          action: 'approve',
          slug: 'goods-receipt.approve',
          name: 'Approve Goods Receipt',
        },
        {
          module: 'operations',
          resource: 'goods-receipt',
          action: 'cancel',
          slug: 'goods-receipt.cancel',
          name: 'Cancel Goods Receipt',
        },
        {
          module: 'operations',
          resource: 'goods-receipt',
          action: 'delete',
          slug: 'goods-receipt.delete',
          name: 'Delete Goods Receipt',
        },
        // Operations - Goods Issuance
        {
          module: 'operations',
          resource: 'goods-issuance',
          action: 'create',
          slug: 'goods-issuance.create',
          name: 'Create Goods Issuance',
        },
        {
          module: 'operations',
          resource: 'goods-issuance',
          action: 'view',
          slug: 'goods-issuance.view',
          name: 'View Goods Issuance',
        },
        {
          module: 'operations',
          resource: 'goods-issuance',
          action: 'update',
          slug: 'goods-issuance.update',
          name: 'Update Goods Issuance',
        },
        {
          module: 'operations',
          resource: 'goods-issuance',
          action: 'approve',
          slug: 'goods-issuance.approve',
          name: 'Approve Goods Issuance',
        },
        {
          module: 'operations',
          resource: 'goods-issuance',
          action: 'cancel',
          slug: 'goods-issuance.cancel',
          name: 'Cancel Goods Issuance',
        },
        {
          module: 'operations',
          resource: 'goods-issuance',
          action: 'delete',
          slug: 'goods-issuance.delete',
          name: 'Delete Goods Issuance',
        },
        // Inventory - Stock Adjustments
        {
          module: 'INVENTORY',
          resource: 'ADJUSTMENT',
          action: 'CREATE',
          slug: 'inventory.adjustment.create',
          name: 'Create Stock Adjustments',
        },
        {
          module: 'INVENTORY',
          resource: 'ADJUSTMENT',
          action: 'READ',
          slug: 'inventory.adjustment.read',
          name: 'Read Stock Adjustments',
        },
        {
          module: 'INVENTORY',
          resource: 'ADJUSTMENT',
          action: 'EDIT',
          slug: 'inventory.adjustment.edit',
          name: 'Edit Stock Adjustments',
        },
        {
          module: 'INVENTORY',
          resource: 'ADJUSTMENT',
          action: 'APPROVE',
          slug: 'inventory.adjustment.approve',
          name: 'Approve Stock Adjustments',
        },
        {
          module: 'INVENTORY',
          resource: 'ADJUSTMENT',
          action: 'CANCEL',
          slug: 'inventory.adjustment.cancel',
          name: 'Cancel Stock Adjustments',
        },
        {
          module: 'INVENTORY',
          resource: 'ADJUSTMENT',
          action: 'DELETE',
          slug: 'inventory.adjustment.delete',
          name: 'Delete Stock Adjustments',
        },
        // Inventory - Stock Transfers
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'CREATE',
          slug: 'inventory.transfer.create',
          name: 'Create Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'READ',
          slug: 'inventory.transfer.read',
          name: 'Read Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'EDIT',
          slug: 'inventory.transfer.edit',
          name: 'Edit Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'APPROVE',
          slug: 'inventory.transfer.approve',
          name: 'Approve Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'SHIP',
          slug: 'inventory.transfer.ship',
          name: 'Ship Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'RECEIVE',
          slug: 'inventory.transfer.receive',
          name: 'Receive Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'CANCEL',
          slug: 'inventory.transfer.cancel',
          name: 'Cancel Stock Transfers',
        },
        {
          module: 'INVENTORY',
          resource: 'TRANSFER',
          action: 'DELETE',
          slug: 'inventory.transfer.delete',
          name: 'Delete Stock Transfers',
        },
        // System - Role
        {
          module: 'system',
          resource: 'role',
          action: 'view',
          slug: 'system.role.view',
          name: 'View Roles',
        },
        {
          module: 'system',
          resource: 'role',
          action: 'manage',
          slug: 'system.role.manage',
          name: 'Manage Roles',
        },
        // System - User
        {
          module: 'system',
          resource: 'user',
          action: 'view',
          slug: 'system.user.view',
          name: 'View Users',
        },
        {
          module: 'system',
          resource: 'user',
          action: 'manage',
          slug: 'system.user.manage',
          name: 'Manage Users',
        },
        // System - Permission
        {
          module: 'system',
          resource: 'permission',
          action: 'view',
          slug: 'system.permission.view',
          name: 'View Permissions',
        },
        // System - Session
        {
          module: 'system',
          resource: 'session',
          action: 'view',
          slug: 'system.session.view',
          name: 'View Sessions',
        },
        {
          module: 'system',
          resource: 'session',
          action: 'manage',
          slug: 'system.session.manage',
          name: 'Manage Sessions',
        },
      ];

      for (const perm of permissions) {
        const existing = await queryRunner.query(
          `SELECT id FROM "system"."permissions" WHERE slug = $1`,
          [perm.slug],
        );

        if (existing.length === 0) {
          // Check if permission exists with same module, action, resource but different slug
          const existingByModule = await queryRunner.query(
            `SELECT id FROM "system"."permissions" WHERE module = $1 AND resource = $2 AND action = $3`,
            [perm.module, perm.resource, perm.action],
          );

          if (existingByModule.length === 0) {
            await queryRunner.query(
              `INSERT INTO "system"."permissions" (
                "module",
                "resource",
                "action",
                "slug",
                "name",
                "is_active",
                "created_at",
                "updated_at"
              ) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
              [perm.module, perm.resource, perm.action, perm.slug, perm.name],
            );
            console.log(`  ✅ Created permission: ${perm.slug}`);
          } else {
            console.log(
              `  ⏭️  Permission with module="${perm.module}", resource="${perm.resource}", action="${perm.action}" already exists, skipping...`,
            );
          }
        } else {
          console.log(
            `  ⏭️  Permission "${perm.slug}" already exists, skipping...`,
          );
        }
      }
    } finally {
      await queryRunner.release();
    }
  },
};
