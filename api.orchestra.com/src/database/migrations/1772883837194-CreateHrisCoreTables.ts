import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHrisCoreTables1772883837194 implements MigrationInterface {
  name = 'CreateHrisCoreTables1772883837194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP CONSTRAINT "fk_user_permissions_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP CONSTRAINT "fk_user_permissions_permission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" DROP CONSTRAINT "FK_plan_modules_plan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" DROP CONSTRAINT "FK_plan_modules_module"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."idx_user_permissions_user_permission"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."idx_user_permissions_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."idx_user_permissions_permission_id"`,
    );
    await queryRunner.query(`DROP INDEX "system"."IDX_plan_modules_plan"`);
    await queryRunner.query(`DROP INDEX "system"."IDX_plan_modules_module"`);
    await queryRunner.query(
      `CREATE TABLE "hris"."designations" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "code" character varying(50), "name" character varying(150) NOT NULL, "level" integer, "description" text, CONSTRAINT "PK_a0f024b99b1491a03fc421858ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d1794e776dc3c016ab8e3126c8" ON "hris"."designations" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_519228d02872a0bb07e508443b" ON "hris"."designations" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_43d6a115dd09868d51494f7545" ON "hris"."designations" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d16a636640549119864f88e4f9" ON "hris"."designations" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."departments" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "code" character varying(50), "name" character varying(150) NOT NULL, "description" text, "head_employee_id" integer, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4fb15c173042ccd356099f69f" ON "hris"."departments" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a3ab2926f3e068ac16ba6ab1be" ON "hris"."departments" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_146fd7019eea73f8ee7bbb52d4" ON "hris"."departments" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4fba15560cbaa583a4e8793921" ON "hris"."departments" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "hris"."branches" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tenant_id" integer NOT NULL, "code" character varying(50), "name" character varying(150) NOT NULL, "address" text, "contact_number" character varying(50), "status" character varying(20) NOT NULL DEFAULT 'Active', CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4900662066b5847a92a11dd7b" ON "hris"."branches" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_644ceffd9545d8dc9449aee158" ON "hris"."branches" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fda619979f40a6a44fc9baf02c" ON "hris"."branches" ("tenant_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_856efe3b58fb0bdef8e262ce67" ON "hris"."branches" ("tenant_id", "code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD "updated_at" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ALTER COLUMN "granted_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ALTER COLUMN "granted_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1b858233a0b25f6cf3bd5b1f2c" ON "system"."user_permissions" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a4db8b46655b113e08424a1f24" ON "system"."user_permissions" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3495bd31f1862d02931e8e8d2e" ON "system"."user_permissions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8145f5fadacd311693c15e41f1" ON "system"."user_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_182c24d39e87d43d5345bb67a8" ON "system"."user_permissions" ("user_id", "permission_id") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d643038a968dcd54f57206e4c0" ON "system"."plan_modules" ("plan_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e71e00cbcbed2ffaf5f4291d8" ON "system"."plan_modules" ("module_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."designations" ADD CONSTRAINT "FK_43d6a115dd09868d51494f7545d" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."departments" ADD CONSTRAINT "FK_146fd7019eea73f8ee7bbb52d4a" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."branches" ADD CONSTRAINT "FK_fda619979f40a6a44fc9baf02c3" FOREIGN KEY ("tenant_id") REFERENCES "system"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "hris"."branches" DROP CONSTRAINT "FK_fda619979f40a6a44fc9baf02c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."departments" DROP CONSTRAINT "FK_146fd7019eea73f8ee7bbb52d4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hris"."designations" DROP CONSTRAINT "FK_43d6a115dd09868d51494f7545d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP CONSTRAINT "FK_8145f5fadacd311693c15e41f10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1e71e00cbcbed2ffaf5f4291d8"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_d643038a968dcd54f57206e4c0"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_182c24d39e87d43d5345bb67a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_8145f5fadacd311693c15e41f1"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_3495bd31f1862d02931e8e8d2e"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_a4db8b46655b113e08424a1f24"`,
    );
    await queryRunner.query(
      `DROP INDEX "system"."IDX_1b858233a0b25f6cf3bd5b1f2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ALTER COLUMN "granted_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ALTER COLUMN "granted_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_856efe3b58fb0bdef8e262ce67"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_fda619979f40a6a44fc9baf02c"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_644ceffd9545d8dc9449aee158"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_c4900662066b5847a92a11dd7b"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."branches"`);
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_4fba15560cbaa583a4e8793921"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_146fd7019eea73f8ee7bbb52d4"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_a3ab2926f3e068ac16ba6ab1be"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_e4fb15c173042ccd356099f69f"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."departments"`);
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_d16a636640549119864f88e4f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_43d6a115dd09868d51494f7545"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_519228d02872a0bb07e508443b"`,
    );
    await queryRunner.query(
      `DROP INDEX "hris"."IDX_d1794e776dc3c016ab8e3126c8"`,
    );
    await queryRunner.query(`DROP TABLE "hris"."designations"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_plan_modules_module" ON "system"."plan_modules" ("module_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plan_modules_plan" ON "system"."plan_modules" ("plan_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_permissions_permission_id" ON "system"."user_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_permissions_user_id" ON "system"."user_permissions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_user_permissions_user_permission" ON "system"."user_permissions" ("permission_id", "user_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" ADD CONSTRAINT "FK_plan_modules_module" FOREIGN KEY ("module_id") REFERENCES "system"."modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."plan_modules" ADD CONSTRAINT "FK_plan_modules_plan" FOREIGN KEY ("plan_id") REFERENCES "system"."plans"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD CONSTRAINT "fk_user_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "system"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."user_permissions" ADD CONSTRAINT "fk_user_permissions_user" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
