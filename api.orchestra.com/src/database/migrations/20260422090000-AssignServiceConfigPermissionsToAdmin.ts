import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignServiceConfigPermissionsToAdmin20260422090000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get all admin users (users with 'admin' role)
    await queryRunner.query(`
      INSERT INTO "system"."user_permissions" (user_id, permission_id, created_at, updated_at)
      SELECT 
        u.id as user_id,
        p.id as permission_id,
        NOW() as created_at,
        NOW() as updated_at
      FROM "system"."users" u
      CROSS JOIN "system"."permissions" p
      LEFT JOIN "system"."user_roles" ur ON u.id = ur.user_id
      LEFT JOIN "system"."roles" r ON ur.role_id = r.id
      WHERE 
        (r.code = 'admin' OR u.email = 'admin@orchestra.com') AND
        p.slug IN (
          'service_config.service_type.view',
          'service_config.service_type.create',
          'service_config.service_type.update',
          'service_config.service_type.delete',
          'service_config.service_option.view',
          'service_config.service_option.create',
          'service_config.service_option.update',
          'service_config.service_option.delete',
          'service_config.service_condition.view',
          'service_config.service_condition.create',
          'service_config.service_condition.update',
          'service_config.service_condition.delete',
          'service_config.service_configuration.view',
          'service_config.service_configuration.create',
          'service_config.service_configuration.update',
          'service_config.service_configuration.delete'
        )
        AND NOT EXISTS (
          SELECT 1 FROM "system"."user_permissions" up 
          WHERE up.user_id = u.id 
          AND up.permission_id = p.id 
          AND up.deleted_at IS NULL
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "system"."user_permissions" 
      WHERE permission_id IN (
        SELECT id FROM "system"."permissions" 
        WHERE slug IN (
          'service_config.service_type.view',
          'service_config.service_type.create',
          'service_config.service_type.update',
          'service_config.service_type.delete',
          'service_config.service_option.view',
          'service_config.service_option.create',
          'service_config.service_option.update',
          'service_config.service_option.delete',
          'service_config.service_condition.view',
          'service_config.service_condition.create',
          'service_config.service_condition.update',
          'service_config.service_condition.delete',
          'service_config.service_configuration.view',
          'service_config.service_configuration.create',
          'service_config.service_configuration.update',
          'service_config.service_configuration.delete'
        )
      );
    `);
  }
}
