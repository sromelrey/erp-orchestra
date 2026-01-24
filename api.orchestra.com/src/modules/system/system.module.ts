import { Module } from '@nestjs/common';
import { UserController } from './users/user.controller';
import { UserModule } from './users/user.module';
import { RoleModule } from './roles/role.module';
import { PermissionModule } from './permissions/permission.module';
import { SessionModule } from './sessions/session.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menus/menu.module';
import { TenantsModule } from './tenants/tenants.module';
import { PlansModule } from './plans/plans.module';
import { SystemModulesModule } from './system-modules/system-modules.module';

@Module({
  controllers: [UserController],
  imports: [
    // Role Base Access Control
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    // Authentication
    SessionModule,
    AuthModule,
    TenantsModule,
    PlansModule,
    SystemModulesModule,
    // System
  ],
})
export class SystemModule {}
