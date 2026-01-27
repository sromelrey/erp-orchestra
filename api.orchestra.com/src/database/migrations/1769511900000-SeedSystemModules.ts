import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSystemModules1769511900000 implements MigrationInterface {
  name = 'SeedSystemModules1769511900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // Get the IDs of the parent modules
    const hrisResult = await queryRunner.query(
      `SELECT id FROM "system"."modules" WHERE code = 'HRIS'`,
    );
    const payrollResult = await queryRunner.query(
      `SELECT id FROM "system"."modules" WHERE code = 'PAYROLL'`,
    );
    const aisResult = await queryRunner.query(
      `SELECT id FROM "system"."modules" WHERE code = 'AIS'`,
    );
    const crmResult = await queryRunner.query(
      `SELECT id FROM "system"."modules" WHERE code = 'CRM'`,
    );
    const inventoryResult = await queryRunner.query(
      `SELECT id FROM "system"."modules" WHERE code = 'INVENTORY'`,
    );
    const pmsResult = await queryRunner.query(
      `SELECT id FROM "system"."modules" WHERE code = 'PMS'`,
    );

    const hrisId = hrisResult[0]?.id;
    const payrollId = payrollResult[0]?.id;
    const aisId = aisResult[0]?.id;
    const crmId = crmResult[0]?.id;
    const inventoryId = inventoryResult[0]?.id;
    const pmsId = pmsResult[0]?.id;

    // Insert sub-modules (type = 'SUB_MODULE')
    // HRIS Sub-modules
    if (hrisId) {
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
        VALUES
          ('Employee Management', 'HRIS_EMP', 'SUB_MODULE', ${hrisId}, true, NOW(), NOW()),
          ('Leave Management', 'HRIS_LEAVE', 'SUB_MODULE', ${hrisId}, true, NOW(), NOW()),
          ('Attendance', 'HRIS_ATTENDANCE', 'SUB_MODULE', ${hrisId}, true, NOW(), NOW()),
          ('Recruitment', 'HRIS_RECRUIT', 'SUB_MODULE', ${hrisId}, true, NOW(), NOW())
      `);
    }

    // Payroll Sub-modules
    if (payrollId) {
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
        VALUES
          ('Salary Processing', 'PAYROLL_SALARY', 'SUB_MODULE', ${payrollId}, true, NOW(), NOW()),
          ('Tax Management', 'PAYROLL_TAX', 'SUB_MODULE', ${payrollId}, true, NOW(), NOW()),
          ('Benefits', 'PAYROLL_BENEFITS', 'SUB_MODULE', ${payrollId}, true, NOW(), NOW())
      `);
    }

    // AIS Sub-modules
    if (aisId) {
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
        VALUES
          ('General Ledger', 'AIS_GL', 'SUB_MODULE', ${aisId}, true, NOW(), NOW()),
          ('Accounts Payable', 'AIS_AP', 'SUB_MODULE', ${aisId}, true, NOW(), NOW()),
          ('Accounts Receivable', 'AIS_AR', 'SUB_MODULE', ${aisId}, true, NOW(), NOW())
      `);
    }

    // CRM Sub-modules
    if (crmId) {
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
        VALUES
          ('Leads', 'CRM_LEADS', 'SUB_MODULE', ${crmId}, true, NOW(), NOW()),
          ('Contacts', 'CRM_CONTACTS', 'SUB_MODULE', ${crmId}, true, NOW(), NOW()),
          ('Opportunities', 'CRM_OPPORTUNITIES', 'SUB_MODULE', ${crmId}, true, NOW(), NOW())
      `);
    }

    // Inventory Sub-modules
    if (inventoryId) {
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
        VALUES
          ('Stock Management', 'INV_STOCK', 'SUB_MODULE', ${inventoryId}, true, NOW(), NOW()),
          ('Warehouse', 'INV_WAREHOUSE', 'SUB_MODULE', ${inventoryId}, true, NOW(), NOW()),
          ('Purchase Orders', 'INV_PO', 'SUB_MODULE', ${inventoryId}, true, NOW(), NOW())
      `);
    }

    // PMS Sub-modules
    if (pmsId) {
      await queryRunner.query(`
        INSERT INTO "system"."modules" ("name", "code", "type", "parent_id", "is_active", "created_at", "updated_at")
        VALUES
          ('Tasks', 'PMS_TASKS', 'SUB_MODULE', ${pmsId}, true, NOW(), NOW()),
          ('Milestones', 'PMS_MILESTONES', 'SUB_MODULE', ${pmsId}, true, NOW(), NOW()),
          ('Timesheets', 'PMS_TIMESHEETS', 'SUB_MODULE', ${pmsId}, true, NOW(), NOW())
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete sub-modules first (due to foreign key constraint)
    await queryRunner.query(
      `DELETE FROM "system"."modules" WHERE "type" = 'SUB_MODULE'`,
    );
    // Delete top-level modules
    await queryRunner.query(
      `DELETE FROM "system"."modules" WHERE "type" = 'MODULE'`,
    );
  }
}
