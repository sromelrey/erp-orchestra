import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantsPlansSystemModules1769257697362 implements MigrationInterface {
  name = 'CreateTenantsPlansSystemModules1769257697362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."users" DROP CONSTRAINT "FK_users_company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" DROP CONSTRAINT "FK_user_roles_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" DROP CONSTRAINT "FK_user_roles_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" DROP CONSTRAINT "FK_role_permissions_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" DROP CONSTRAINT "FK_role_permissions_permission"`,
    );
    await queryRunner.query(`DROP INDEX "system"."IDX_session_expiredAt"`);
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_d428775a3fe92626ec53f47bb1"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_7a0fb957b92f20b1a5e42e6d72"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_e0af6143a5ca5d5f2c035dc1e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1fcb8561db770f3e53b8fd78a5"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_04a33863164d42b8a0f64c589e"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1e400d83cfface68080a4c4e6a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_76bf604bd1ff21dfe488aaae0b"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_084286efca7f18f61594f8397f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_030eddd05a5669d803c451b91c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."materials" RENAME COLUMN "company_id" TO "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" RENAME COLUMN "company_id" TO "tenant_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."menus" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "module_id" integer, "parent_id" integer, "permission_id" integer, "label" character varying(100) NOT NULL, "path" character varying(255), "icon" character varying(50), "sort_order" integer NOT NULL DEFAULT '0', "is_visible" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40114ecec7b4aa6504e77018fd" ON "system"."menus" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85ebcd22c13578e1da62ad99c0" ON "system"."menus" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6d332e40ce5d5773fc5f71eb7" ON "system"."menus" ("module_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_00ccc1ed4e9fc23bc124626935" ON "system"."menus" ("parent_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59188f7331fc3294dc296ad020" ON "system"."menus" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2f89009982a9ec7182f21f8665" ON "system"."menus" ("parent_id", "sort_order") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."modules" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(50) NOT NULL, "code" character varying(20) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8cd1abde4b70e59644c98668c06" UNIQUE ("name"), CONSTRAINT "UQ_25b42b11ac8b697cdb2eddcef1a" UNIQUE ("code"), CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a1b8ab9cfd9c4d019a2729dd07" ON "system"."modules" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddfe513651086b094687837eed" ON "system"."modules" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."plans" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(50) NOT NULL, "monthlyPrice" numeric(12,2) NOT NULL DEFAULT '0', "max_users" integer NOT NULL DEFAULT '5', CONSTRAINT "UQ_253d25dae4c94ee913bc5ec4850" UNIQUE ("name"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c5f6f43e87905766afe5590b5" ON "system"."plans" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53619d9547e06c47ded0fe4398" ON "system"."plans" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "system"."tenants_status_enum" AS ENUM('active', 'suspended', 'trial', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."tenants" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "slug" character varying(100) NOT NULL, "status" "system"."tenants_status_enum" NOT NULL DEFAULT 'trial', "plan_id" integer NOT NULL, "logo_url" character varying, CONSTRAINT "UQ_2310ecc5cb8be427097154b18fc" UNIQUE ("slug"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_362ad28591b5e679733c37b115" ON "system"."tenants" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1dba291f7611c0f2388055c40b" ON "system"."tenants" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2310ecc5cb8be427097154b18f" ON "system"."tenants" ("slug") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_131aa6229f6e235bb17c596546" ON "system"."tenants" ("name") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."plan_modules" ("plan_id" integer NOT NULL, "module_id" integer NOT NULL, CONSTRAINT "PK_c31e49744a1a3e2949ffa18535f" PRIMARY KEY ("plan_id", "module_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d643038a968dcd54f57206e4c0" ON "system"."plan_modules" ("plan_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e71e00cbcbed2ffaf5f4291d8" ON "system"."plan_modules" ("module_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP CONSTRAINT "UQ_permissions_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD "module" character varying(50) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD "resource" character varying(50) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD "action" character varying(50) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD "slug" character varying(100) NOT NULL DEFAULT ''`,
    );
    // Generate unique slugs for existing rows to satisfy the unique constraint
    await queryRunner.query(
      `UPDATE "system"."permissions" SET "slug" = 'perm-' || "id" WHERE "slug" = ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD CONSTRAINT "UQ_d090ad82a0e97ce764c06c7b312" UNIQUE ("slug")`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ADD "tenant_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD "tenant_id" integer`,
    );
    // await queryRunner.query(`ALTER TABLE "system"."roles" DROP COLUMN "name"`);
    // await queryRunner.query(`ALTER TABLE "system"."roles" ADD "name" character varying(100) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "system"."roles" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "system"."roles_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ADD "status" "system"."roles_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "system"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'BANNED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD "status" "system"."users_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ALTER COLUMN "assigned_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c398f7100db3e0d9b6a6cd6bea" ON "system"."permissions" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_337088ff813c697c964f49f58f" ON "system"."permissions" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b634526cdd01f2adba6c7ac07" ON "system"."permissions" ("module") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89456a09b598ce8915c702c528" ON "system"."permissions" ("resource") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e8253e305f83f9d9cc134cd4b3" ON "system"."permissions" ("module", "resource", "action") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3b54f1f0490818fab86de1c03a" ON "system"."permissions" ("slug") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a39f3095781cdd9d6061afaae" ON "system"."roles" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e5a52fc6f7a8dae64f645b0914" ON "system"."roles" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e59a01f4fe46ebbece575d9a0f" ON "system"."roles" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1afbd0213089610355c3021e37" ON "system"."roles" ("tenant_id", "name") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_397436cc6a5eb604cb70df0d4b" ON "system"."roles" ("code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f32b1cb14a9920477bcfd63df2" ON "system"."users" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9b5b525a96ddc2c5647d7f7fa" ON "system"."users" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_109638590074998bb72a2f2cf0" ON "system"."users" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "system"."users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d8d7e8ed43534df6728dfef87" ON "system"."users" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "system"."users" ("email") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_947e863084a338ac018f1beab9" ON "system"."user_roles" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57c0e3aef56ade8d2465c237d8" ON "system"."user_roles" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "system"."user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "system"."user_roles" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bd9886cd646e8905f614d7d55a" ON "system"."user_roles" ("user_id", "role_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "system"."session" ("expiredAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a731453130efd9b40d4ab5f962" ON "system"."role_permissions" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61b711957d7b61b17a5625eb0e" ON "system"."role_permissions" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "system"."role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "system"."role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7953b8be5ad582c83dd350539d" ON "system"."role_permissions" ("role_id", "permission_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fbcca407c4c69cab97df478748" ON "operations"."materials" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35420aab177852fa33941b8ca2" ON "operations"."materials" ("tenant_id", "is_active") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc7070b1a19eb236d231a5c3b2" ON "operations"."materials" ("tenant_id", "material_group") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d477ea1e1e386bd06d08b839a" ON "operations"."materials" ("tenant_id", "material_type") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98bbd57efaf9a24784864efb85" ON "operations"."materials" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb2bdc79ded5753e40f98ade47" ON "operations"."boms" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15726f5d46c069f614994f782a" ON "operations"."boms" ("tenant_id", "status") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_173407967babe41d2d19a0f4bc" ON "operations"."boms" ("tenant_id", "parent_material_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4128fcd171c10e9492da3eb972" ON "operations"."boms" ("tenant_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."menus" ADD CONSTRAINT "FK_c6d332e40ce5d5773fc5f71eb7f" FOREIGN KEY ("module_id") REFERENCES "system"."modules"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."menus" ADD CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359" FOREIGN KEY ("parent_id") REFERENCES "system"."menus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."menus" ADD CONSTRAINT "FK_59188f7331fc3294dc296ad0205" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ADD CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."tenants" ADD CONSTRAINT "FK_919d143d2411832db812bbc600e" FOREIGN KEY ("plan_id") REFERENCES "system"."plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."materials" ADD CONSTRAINT "FK_fbcca407c4c69cab97df4787481" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" ADD CONSTRAINT "FK_eb2bdc79ded5753e40f98ade47e" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" ADD CONSTRAINT "FK_d643038a968dcd54f57206e4c05" FOREIGN KEY ("plan_id") REFERENCES "system"."plans"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" ADD CONSTRAINT "FK_1e71e00cbcbed2ffaf5f4291d8f" FOREIGN KEY ("module_id") REFERENCES "system"."modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" DROP CONSTRAINT "FK_1e71e00cbcbed2ffaf5f4291d8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" DROP CONSTRAINT "FK_d643038a968dcd54f57206e4c05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" DROP CONSTRAINT "FK_eb2bdc79ded5753e40f98ade47e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."materials" DROP CONSTRAINT "FK_fbcca407c4c69cab97df4787481"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."tenants" DROP CONSTRAINT "FK_919d143d2411832db812bbc600e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" DROP CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."menus" DROP CONSTRAINT "FK_59188f7331fc3294dc296ad0205"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."menus" DROP CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."menus" DROP CONSTRAINT "FK_c6d332e40ce5d5773fc5f71eb7f"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_4128fcd171c10e9492da3eb972"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_173407967babe41d2d19a0f4bc"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_15726f5d46c069f614994f782a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_eb2bdc79ded5753e40f98ade47"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_98bbd57efaf9a24784864efb85"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_1d477ea1e1e386bd06d08b839a"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_cc7070b1a19eb236d231a5c3b2"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_35420aab177852fa33941b8ca2"`,
    );
    await queryRunner.query(
      `DROP INDEX "operations"."IDX_fbcca407c4c69cab97df478748"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_7953b8be5ad582c83dd350539d"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_17022daf3f885f7d35423e9971"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_178199805b901ccd220ab7740e"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_61b711957d7b61b17a5625eb0e"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_a731453130efd9b40d4ab5f962"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_28c5d1d16da7908c97c9bc2f74"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_bd9886cd646e8905f614d7d55a"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_b23c65e50a758245a33ee35fda"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_87b8888186ca9769c960e92687"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_57c0e3aef56ade8d2465c237d8"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_947e863084a338ac018f1beab9"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_b383987bfa6e6a8745085621d0"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_7d8d7e8ed43534df6728dfef87"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_109638590074998bb72a2f2cf0"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_c9b5b525a96ddc2c5647d7f7fa"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_f32b1cb14a9920477bcfd63df2"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_397436cc6a5eb604cb70df0d4b"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1afbd0213089610355c3021e37"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_e59a01f4fe46ebbece575d9a0f"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_e5a52fc6f7a8dae64f645b0914"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_4a39f3095781cdd9d6061afaae"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_3b54f1f0490818fab86de1c03a"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_e8253e305f83f9d9cc134cd4b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_89456a09b598ce8915c702c528"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_8b634526cdd01f2adba6c7ac07"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_337088ff813c697c964f49f58f"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_c398f7100db3e0d9b6a6cd6bea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ALTER COLUMN "assigned_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" DROP COLUMN "status"`,
    );
    await queryRunner.query(`DROP TYPE "system"."users_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" DROP COLUMN "status"`,
    );
    await queryRunner.query(`DROP TYPE "system"."roles_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`,
    );
    // await queryRunner.query(`ALTER TABLE "system"."roles" DROP COLUMN "name"`);
    // await queryRunner.query(`ALTER TABLE "system"."roles" ADD "name" character varying(50) NOT NULL`);
    // Changed to ALTER to preserve data
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ALTER COLUMN "name" TYPE character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" DROP COLUMN "tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP CONSTRAINT "UQ_d090ad82a0e97ce764c06c7b312"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP COLUMN "slug"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP COLUMN "action"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP COLUMN "resource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" DROP COLUMN "module"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD "company_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."roles" ADD "company_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD "code" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."permissions" ADD CONSTRAINT "UQ_permissions_code" UNIQUE ("code")`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1e71e00cbcbed2ffaf5f4291d8"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_d643038a968dcd54f57206e4c0"`,
    );
    await queryRunner.query(`DROP TABLE "system"."plan_modules"`);
    await queryRunner.query(
      `DROP INDEX "system"."IDX_131aa6229f6e235bb17c596546"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_2310ecc5cb8be427097154b18f"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1dba291f7611c0f2388055c40b"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_362ad28591b5e679733c37b115"`,
    );
    await queryRunner.query(`DROP TABLE "system"."tenants"`);
    await queryRunner.query(`DROP TYPE "system"."tenants_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "system"."IDX_53619d9547e06c47ded0fe4398"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_7c5f6f43e87905766afe5590b5"`,
    );
    await queryRunner.query(`DROP TABLE "system"."plans"`);
    await queryRunner.query(
      `DROP INDEX "system"."IDX_ddfe513651086b094687837eed"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_a1b8ab9cfd9c4d019a2729dd07"`,
    );
    await queryRunner.query(`DROP TABLE "system"."modules"`);
    await queryRunner.query(
      `DROP INDEX "system"."IDX_2f89009982a9ec7182f21f8665"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_59188f7331fc3294dc296ad020"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_00ccc1ed4e9fc23bc124626935"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_c6d332e40ce5d5773fc5f71eb7"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_85ebcd22c13578e1da62ad99c0"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_40114ecec7b4aa6504e77018fd"`,
    );
    await queryRunner.query(`DROP TABLE "system"."menus"`);
    await queryRunner.query(
      `ALTER TABLE "operations"."boms" RENAME COLUMN "tenant_id" TO "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operations"."materials" RENAME COLUMN "tenant_id" TO "company_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_030eddd05a5669d803c451b91c" ON "operations"."boms" ("company_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_084286efca7f18f61594f8397f" ON "operations"."boms" ("company_id", "parent_material_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_76bf604bd1ff21dfe488aaae0b" ON "operations"."boms" ("company_id", "status") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e400d83cfface68080a4c4e6a" ON "operations"."boms" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_04a33863164d42b8a0f64c589e" ON "operations"."materials" ("company_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fcb8561db770f3e53b8fd78a5" ON "operations"."materials" ("company_id", "material_type") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0af6143a5ca5d5f2c035dc1e2" ON "operations"."materials" ("company_id", "material_group") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a0fb957b92f20b1a5e42e6d72" ON "operations"."materials" ("company_id", "is_active") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d428775a3fe92626ec53f47bb1" ON "operations"."materials" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_session_expiredAt" ON "system"."session" ("expiredAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" ADD CONSTRAINT "FK_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."role_permissions" ADD CONSTRAINT "FK_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ADD CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_roles" ADD CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."users" ADD CONSTRAINT "FK_users_company" FOREIGN KEY ("company_id") REFERENCES "system"."companies"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
