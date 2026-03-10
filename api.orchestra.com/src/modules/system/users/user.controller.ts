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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { UpdateTenantUserDto } from './dto/update-tenant-user.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { User } from '../../../entities/system/user.entity';
import { PaginatedResult } from '@/types';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';

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
}
