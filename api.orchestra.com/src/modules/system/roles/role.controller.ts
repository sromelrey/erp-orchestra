import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/entities/system/role.entity';

/**
 * Controller for managing Role resources.
 *
 * Provides CRUD endpoints and permission assignment.
 * Access is restricted to users with ADMIN role.
 */
@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles('ADMIN')
@Controller('system/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Lists all roles.
   */
  @Get()
  @ApiOperation({ summary: 'List all roles' })
  @ApiResponse({ status: 200, description: 'Returns all roles.' })
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  /**
   * Gets a role by ID with its permissions.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID with permissions' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns the role with permissions.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roleService.findOne(id);
  }

  /**
   * Creates a new role.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(dto);
  }

  /**
   * Updates an existing role.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, dto);
  }

  /**
   * Soft deletes a role.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roleService.remove(id);
  }

  /**
   * Assigns permissions to a role.
   */
  @Post(':id/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AssignPermissionsDto })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned successfully.',
  })
  @ApiResponse({ status: 404, description: 'Role or permission not found.' })
  assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignPermissionsDto,
  ): Promise<Role> {
    return this.roleService.assignPermissions(id, dto.permissionIds);
  }

  /**
   * Removes permissions from a role.
   */
  @Delete(':id/permissions')
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AssignPermissionsDto })
  @ApiResponse({
    status: 200,
    description: 'Permissions removed successfully.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignPermissionsDto,
  ): Promise<Role> {
    return this.roleService.removePermissions(id, dto.permissionIds);
  }
}
