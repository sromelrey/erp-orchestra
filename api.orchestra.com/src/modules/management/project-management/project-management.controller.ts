import { Controller } from '@nestjs/common';
import { ProjectManagementService } from './project-management.service';

@Controller('project-management')
export class ProjectManagementController {
  constructor(private readonly projectManagementService: ProjectManagementService) {}
}
