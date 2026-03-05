import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../../entities/system/user.entity';
import { Tenant } from '../../../entities/system/tenant.entity';
import { UserRole } from '../../../entities/system/user-role.entity';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, UserRole]),
    PermissionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
