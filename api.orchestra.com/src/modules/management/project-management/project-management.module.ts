import { Module } from '@nestjs/common';
import { ProjectManagementService } from './project-management.service';
import { ProjectManagementController } from './project-management.controller';

@Module({
  controllers: [ProjectManagementController],
  providers: [ProjectManagementService],
})
export class ProjectManagementModule {}
