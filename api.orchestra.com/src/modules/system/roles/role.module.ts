import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '@/entities/system/role.entity';
import { RolePermission } from '@/entities/system/role-permission.entity';
import { Permission } from '@/entities/system/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission, Permission])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
