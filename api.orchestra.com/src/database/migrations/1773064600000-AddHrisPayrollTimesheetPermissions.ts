import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHrisPayrollTimesheetPermissions1773064600000 implements MigrationInterface {
  name = 'AddHrisPayrollTimesheetPermissions1773064600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissions = [
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
    ];

    for (const perm of permissions) {
      const existing = await queryRunner.query(
        `SELECT id FROM "system"."permissions" WHERE slug = $1`,
        [perm.slug],
      );

      if (existing.length === 0) {
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
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slugs = [
      'hris.payroll.view',
      'hris.payroll.manage',
      'hris.timesheet.view',
      'hris.timesheet.manage',
    ];

    for (const slug of slugs) {
      await queryRunner.query(
        `DELETE FROM "system"."permissions" WHERE slug = $1`,
        [slug],
      );
    }
  }
}
