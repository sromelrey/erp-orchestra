import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { SessionModule } from './session/session.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { MenuModule } from './menu/menu.module';

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
    // System
    CompanyModule,
  ],
})
export class SystemModule {}
