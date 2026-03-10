import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role, RolePermission, Permission, UserRole } from '@/entities';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, Permission, UserRole]),
    PermissionModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
