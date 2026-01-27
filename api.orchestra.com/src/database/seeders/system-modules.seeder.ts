import { DataSource } from 'typeorm';
import { Seeder } from './seeder.config';

/**
 * Seeds the system modules table with top-level modules and sub-modules.
 */
export const SystemModulesSeeder: Seeder = {
  name: 'SystemModulesSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      // Check if modules already exist
      const existingModules = await queryRunner.query(
        `SELECT COUNT(*) as count FROM "system"."modules"`,
      );

      if (parseInt(existingModules[0].count) > 0) {
        console.log('  → Modules already seeded, skipping...');
        return;
      }

      // Insert top-level modules (type = 'MODULE')
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "is_active", "created_at", "updated_at")
        VALUES
          ('Human Resources', 'HRIS', 'MODULE', true, NOW(), NOW()),
          ('Payroll', 'PAYROLL', 'MODULE', true, NOW(), NOW()),
          ('Accounting', 'AIS', 'MODULE', true, NOW(), NOW()),
          ('Customer Relations', 'CRM', 'MODULE', true, NOW(), NOW()),
          ('Inventory Management', 'INVENTORY', 'MODULE', true, NOW(), NOW()),
          ('Project Management', 'PMS', 'MODULE', true, NOW(), NOW())
      `);

      // Get parent module IDs
      const modules = await queryRunner.query(
        `SELECT id, code FROM "system"."modules" WHERE type = 'MODULE'`,
      );

      const moduleMap: Record<string, number> = {};
      for (const mod of modules) {
        moduleMap[mod.code] = mod.id;
      }

      // Insert sub-modules
      const subModules = [
        // HRIS
        { name: 'Employee Management', code: 'HRIS_EMP', parent: 'HRIS' },
        { name: 'Leave Management', code: 'HRIS_LEAVE', parent: 'HRIS' },
        { name: 'Attendance', code: 'HRIS_ATTENDANCE', parent: 'HRIS' },
        { name: 'Recruitment', code: 'HRIS_RECRUIT', parent: 'HRIS' },
        // Payroll
        {
          name: 'Salary Processing',
          code: 'PAYROLL_SALARY',
          parent: 'PAYROLL',
        },
        { name: 'Tax Management', code: 'PAYROLL_TAX', parent: 'PAYROLL' },
        { name: 'Benefits', code: 'PAYROLL_BENEFITS', parent: 'PAYROLL' },
        // AIS
        { name: 'General Ledger', code: 'AIS_GL', parent: 'AIS' },
        { name: 'Accounts Payable', code: 'AIS_AP', parent: 'AIS' },
        { name: 'Accounts Receivable', code: 'AIS_AR', parent: 'AIS' },
        // CRM
        { name: 'Leads', code: 'CRM_LEADS', parent: 'CRM' },
        { name: 'Contacts', code: 'CRM_CONTACTS', parent: 'CRM' },
        { name: 'Opportunities', code: 'CRM_OPPORTUNITIES', parent: 'CRM' },
        // Inventory
        { name: 'Stock Management', code: 'INV_STOCK', parent: 'INVENTORY' },
        { name: 'Warehouse', code: 'INV_WAREHOUSE', parent: 'INVENTORY' },
        { name: 'Purchase Orders', code: 'INV_PO', parent: 'INVENTORY' },
        // PMS
        { name: 'Tasks', code: 'PMS_TASKS', parent: 'PMS' },
        { name: 'Milestones', code: 'PMS_MILESTONES', parent: 'PMS' },
        { name: 'Timesheets', code: 'PMS_TIMESHEETS', parent: 'PMS' },
      ];

      for (const sub of subModules) {
        const parentId = moduleMap[sub.parent];
        if (parentId) {
          await queryRunner.query(
            `INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
             VALUES ($1, $2, 'SUB_MODULE', $3, true, NOW(), NOW())`,
            [sub.name, sub.code, parentId],
          );
        }
      }

      console.log('  → Seeded 6 modules and 19 sub-modules');
    } finally {
      await queryRunner.release();
    }
  },
};
