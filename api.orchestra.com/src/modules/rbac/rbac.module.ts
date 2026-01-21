import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  controllers: [UserController],
  imports: [UserModule, RoleModule, PermissionModule]
})
export class RbacModule {}
