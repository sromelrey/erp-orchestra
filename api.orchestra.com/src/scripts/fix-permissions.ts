import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/database.config';

async function fixPermissions() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    ssl: false,
  });
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();

  try {
    console.log('Updating role permissions...');

    // Update role permissions to point to the new permissions
    const mappings = [
      {
        oldSlug: 'goods-receipt.create',
        newSlug: 'operations.goods-receipt.create',
      },
      {
        oldSlug: 'goods-receipt.view',
        newSlug: 'operations.goods-receipt.view',
      },
      {
        oldSlug: 'goods-receipt.update',
        newSlug: 'operations.goods-receipt.update',
      },
      {
        oldSlug: 'goods-receipt.approve',
        newSlug: 'operations.goods-receipt.confirm',
      },
      {
        oldSlug: 'goods-receipt.cancel',
        newSlug: 'operations.goods-receipt.cancel',
      },
      {
        oldSlug: 'goods-receipt.delete',
        newSlug: 'operations.goods-receipt.delete',
      },
    ];

    for (const { oldSlug, newSlug } of mappings) {
      const result = await queryRunner.query(
        `
        UPDATE "system"."role_permissions" rp
        SET permission_id = new_perm.id
        FROM "system"."permissions" old_perm, "system"."permissions" new_perm
        WHERE rp.permission_id = old_perm.id
        AND old_perm.slug = $1
        AND new_perm.slug = $2
      `,
        [oldSlug, newSlug],
      );

      console.log(`Updated ${oldSlug} -> ${newSlug}: ${result.affected} rows`);
    }

    // Delete the old permissions
    console.log('Deleting old permissions...');
    const deleteResult = await queryRunner.query(`
      DELETE FROM "system"."permissions" WHERE slug IN (
        'goods-receipt.create',
        'goods-receipt.view', 
        'goods-receipt.update',
        'goods-receipt.approve',
        'goods-receipt.cancel',
        'goods-receipt.delete'
      )
    `);
    console.log(`Deleted ${deleteResult.length} old permissions`);

    // Verify the new permissions exist
    const newPermissions = await queryRunner.query(`
      SELECT slug, name FROM "system"."permissions" WHERE slug LIKE 'operations.goods-receipt.%'
    `);
    console.log('\nNew permissions:', newPermissions);

    // Check if admin role has the view permission
    const adminPermission = await queryRunner.query(`
      SELECT p.slug FROM "system"."permissions" p
      JOIN "system"."role_permissions" rp ON p.id = rp.permission_id
      JOIN "system"."roles" r ON rp.role_id = r.id
      WHERE r.code = 'SYSTEM_ADMIN' AND p.slug = 'operations.goods-receipt.view'
    `);

    if (adminPermission.length > 0) {
      console.log(
        '\n✅ Admin role has operations.goods-receipt.view permission',
      );
    } else {
      console.log(
        '\n❌ Admin role does NOT have operations.goods-receipt.view permission',
      );
    }
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

fixPermissions()
  .then(() => {
    console.log('\n✅ Permissions fixed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fixing permissions:', error);
    process.exit(1);
  });
