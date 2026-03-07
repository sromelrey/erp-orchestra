import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { Branch } from '@/entities/hris/branch.entity';
import { PermissionModule } from '../../system/permissions/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), PermissionModule],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
