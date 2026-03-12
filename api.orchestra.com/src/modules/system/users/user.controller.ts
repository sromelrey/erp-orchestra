import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Patch,
  Delete,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { UpdateTenantUserDto } from './dto/update-tenant-user.dto';
import { AssignUserPermissionsDto } from './dto/assign-user-permissions.dto';
import { RemoveUserPermissionsDto } from './dto/remove-user-permissions.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { User } from '../../../entities/system/user.entity';
import { UserPermission } from '../../../entities/system/user-permission.entity';
import { PaginatedResult } from '@/types';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';

/**
 * Controller for managing users and their permissions.
 *
 * This controller handles CRUD operations for users and provides specialized
 * endpoints for managing user-specific permission overrides. User permissions
 * allow for fine-grained control that supplements or overrides role-based permissions.
 *
 * Features:
 * - Standard user CRUD operations
 * - Bulk permission assignment with GRANT/DENY types
 * - Permission expiration support for temporary access
 * - Effective permission calculation combining roles and user overrides
 */
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * List users for the current tenant.
   */
  @Get()
  @RequirePermissions('system.user.view')
  @ApiOperation({ summary: 'List users for the current tenant' })
  @ApiResponse({ status: 200, description: 'Return paginated users.' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<User>> {
    return this.userService.findAllForTenant(req.user.tenantId!, paginationDto);
  }

  /**
   * Create a user for the current tenant.
   */
  @Post()
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Create a user for the current tenant' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiBody({ type: CreateTenantUserDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createDto: CreateTenantUserDto,
  ): Promise<User> {
    return this.userService.createForTenant(req.user.tenantId!, createDto);
  }

  /**
   * Get a user by ID within the current tenant.
   */
  @Get(':id')
  @RequirePermissions('system.user.view')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return this.userService.findOneForTenant(req.user.tenantId!, id);
  }

  /**
   * Update a user within the current tenant.
   */
  @Patch(':id')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTenantUserDto,
  ): Promise<User> {
    return this.userService.updateForTenant(req.user.tenantId!, id, updateDto);
  }

  /**
   * Remove a user within the current tenant.
   */
  @Delete(':id')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Remove a user' })
  @ApiResponse({ status: 200, description: 'User removed successfully.' })
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.userService.removeForTenant(req.user.tenantId!, id);
  }

  /**
   * List users for a specific tenant.
   * Restricted to SUPER_ADMIN only.
   */
  @Get('tenant/:tenantId')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List users for a specific tenant' })
  @ApiResponse({ status: 200, description: 'Return paginated users.' })
  async findAllForTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<User>> {
    return this.userService.findAllForTenant(tenantId, paginationDto);
  }

  /**
   * Create a user for a specific tenant.
   * Restricted to SUPER_ADMIN only.
   */
  @Post('tenant/:tenantId')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a user for a specific tenant' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiBody({ type: CreateTenantUserDto })
  async createForTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createDto: CreateTenantUserDto,
  ): Promise<User> {
    return this.userService.createForTenant(tenantId, createDto);
  }

  /**
   * Assigns permissions to a user.
   *
   * Bulk assigns permissions to a user with support for GRANT/DENY types and expiration dates.
   * This operation is performed within a transaction to ensure data consistency.
   *
   * @param id - The unique identifier of the user
   * @param dto - The permission assignment data containing permission IDs, type, and optional expiration
   * @param req - The authenticated request context containing tenant information
   * @returns Promise<User> - The updated user with assigned permissions
   * @throws {NotFoundException} If the user or specified permissions do not exist
   * @throws {ConflictException} If permissions are already assigned with the same type
   * @throws {BadRequestException} If permission data is invalid or expiration date is in the past
   */
  @Post(':id/permissions')
  @RequirePermissions('system.user.manage')
  @ApiOperation({
    summary: 'Assign permissions to a user',
    description:
      'Bulk assign permissions to a user with support for GRANT/DENY types and expiration dates. This endpoint allows for fine-grained permission control at the user level, overriding role-based permissions.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: AssignUserPermissionsDto })
  @ApiResponse({
    status: 200,
    description:
      'Permissions assigned successfully. Returns the updated user object.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User or permission not found.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid permission data or expiration date in the past.',
  })
  @ApiResponse({
    status: 409,
    description: 'Permissions already assigned with the same type.',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions to manage user permissions.',
  })
  async assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignUserPermissionsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    const existingPermissions = await this.userService.getUserPermissions(
      id,
      req.user.tenantId ?? undefined,
    );

    if (
      existingPermissions.some((permission) => permission.type === dto.type)
    ) {
      throw new ConflictException(
        `Permissions are already assigned with the same type.`,
      );
    }

    return this.userService.assignPermissions(
      id,
      dto.permissionIds,
      dto.type || 'GRANT',
      req.user.tenantId ?? undefined,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }

  /**
   * Removes permissions from a user.
   *
   * Bulk removes permissions from a user. Send empty array to clear all permissions.
   * This operation is performed within a transaction to ensure data consistency.
   *
   * @param id - The unique identifier of the user
   * @param dto - The permission removal data containing permission IDs to remove
   * @param req - The authenticated request context containing tenant information
   * @returns Promise<User> - The updated user with permissions removed
   * @throws {NotFoundException} If the user does not exist
   * @throws {BadRequestException} If permission data is invalid
   */
  @Delete(':id/permissions')
  @RequirePermissions('system.user.manage')
  @ApiOperation({
    summary: 'Remove permissions from a user',
    description:
      'Bulk remove permissions from a user. Send empty array to clear all permissions. This endpoint allows for removal of user-specific permission overrides, reverting to role-based permissions.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: RemoveUserPermissionsDto })
  @ApiResponse({
    status: 200,
    description:
      'Permissions removed successfully. Returns the updated user object.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid permission data.' })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions to manage user permissions.',
  })
  async removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RemoveUserPermissionsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    // Remove specific permissions
    await this.userService.removePermissions(
      id,
      dto.permissionIds,
      req.user.tenantId ?? undefined,
    );

    return this.userService.findOneForTenant(req.user.tenantId!, id);
  }

  /**
   * Gets user permissions.
   *
   * Retrieve all direct permissions assigned to a specific user.
   * This endpoint returns user-specific permission overrides, not including role-based permissions.
   *
   * @param id - The unique identifier of the user
   * @param req - The authenticated request context containing tenant information
   * @returns Promise<UserPermission[]> - Array of user permissions with full details including permission objects and expiration dates
   * @throws {NotFoundException} If the user does not exist
   * @throws {ForbiddenException} If requesting user lacks permission to view user permissions
   */
  @Get(':id/permissions')
  @RequirePermissions('system.user.view')
  @ApiOperation({
    summary: 'Get user permissions',
    description:
      'Retrieve all direct permissions assigned to a specific user. This endpoint returns user-specific permission overrides (GRANT/DENY) with expiration dates, excluding role-based permissions.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description:
      'User permissions retrieved successfully. Returns array of UserPermission objects with full permission details.',
    type: [UserPermission],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions to view user permissions.',
  })
  async getUserPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserPermission[]> {
    return this.userService.getUserPermissions(
      id,
      req.user.tenantId ?? undefined,
    );
  }

  /**
   * Gets effective permissions for a user.
   *
   * Calculate effective permissions combining role permissions and user-specific GRANT/DENY overrides.
   * This endpoint computes the final permission set by applying role permissions first,
   * then applying user GRANT permissions, and finally removing any user DENY overrides.
   *
   * @param id - The unique identifier of the user
   * @returns Promise<string[]> - Array of effective permission slugs representing the final permission set
   * @throws {NotFoundException} If the user does not exist
   * @throws {ForbiddenException} If requesting user lacks permission to view user permissions
   */
  @Get(':id/permissions/effective')
  @RequirePermissions('system.user.view')
  @ApiOperation({
    summary: 'Get effective permissions for a user',
    description:
      'Calculate effective permissions combining role permissions and user-specific GRANT/DENY overrides. This endpoint computes the final permission set by merging role-based permissions with user-specific overrides, where DENY overrides take precedence over GRANT.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description:
      'Effective permissions retrieved successfully. Returns array of permission slugs representing the final computed permission set.',
    type: [String],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions to view user permissions.',
  })
  async getEffectivePermissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string[]> {
    return this.userService.getEffectivePermissions(id);
  }
}
