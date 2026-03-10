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
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Department } from '@/entities';
import { PaginatedResult } from '@/types';
import { AuthenticatedRequest } from '@/types/authenticated-request';

/**
 * Controller for managing Department resources.
 *
 * Provides CRUD endpoints for departments.
 * Access is controlled via slug-based permissions (hris.department.view / hris.department.manage).
 */
@ApiTags('HRIS - Departments')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Lists all departments for the authenticated user's tenant with cursor pagination.
   */
  @Get()
  @RequirePermissions('hris.department.view')
  @ApiOperation({ summary: 'List departments with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of departments.',
  })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Department>> {
    return this.departmentService.findAll(req.user.tenantId!, paginationDto);
  }

  /**
   * Gets a department by ID.
   */
  @Get(':id')
  @RequirePermissions('hris.department.view')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns the department.',
    type: Department,
  })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Department> {
    return this.departmentService.findOne(id, req.user.tenantId!);
  }

  /**
   * Creates a new department.
   */
  @Post()
  @RequirePermissions('hris.department.manage')
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully.',
    type: Department,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(
    @Body() dto: CreateDepartmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Department> {
    return this.departmentService.create(dto, req.user.tenantId!);
  }

  /**
   * Updates an existing department.
   */
  @Patch(':id')
  @RequirePermissions('hris.department.manage')
  @ApiOperation({ summary: 'Update a department' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully.',
    type: Department,
  })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Department> {
    return this.departmentService.update(id, dto, req.user.tenantId!);
  }

  /**
   * Soft-deletes a department.
   */
  @Delete(':id')
  @RequirePermissions('hris.department.manage')
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Department deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.departmentService.remove(id, req.user.tenantId!);
  }
}
