import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../guards/authenticated.guard';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(AuthenticatedGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  async findAll() {
    return this.roleService.findAll();
  }
}
