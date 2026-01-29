import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from '@/entities/system/permission.entity';
import { RolePermission } from '@/entities/system/role-permission.entity';
import { UserRole } from '@/entities/system/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, RolePermission, UserRole])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
