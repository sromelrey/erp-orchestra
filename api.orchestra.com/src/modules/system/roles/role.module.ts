import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '@/entities/system/role.entity';
import { RolePermission } from '@/entities/system/role-permission.entity';
import { Permission } from '@/entities/system/permission.entity';
import { UserRole } from '@/entities/system/user-role.entity';
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
