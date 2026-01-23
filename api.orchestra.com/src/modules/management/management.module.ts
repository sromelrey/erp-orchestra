import { Module } from '@nestjs/common';
import { ProjectManagementModule } from './project-management/project-management.module';

@Module({
  imports: [ProjectManagementModule],
})
export class ManagementModule {}
