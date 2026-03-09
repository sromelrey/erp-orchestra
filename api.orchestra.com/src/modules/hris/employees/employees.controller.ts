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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Employee } from '@/entities/hris/employee.entity';
import { User } from '@/entities/system/user.entity';
import { PaginatedResult } from '@/types';

interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Controller for managing Employee resources.
 *
 * Provides CRUD endpoints for employees.
 * Access is controlled via slug-based permissions (hris.employee.view / hris.employee.manage).
 */
@ApiTags('HRIS - Employees')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  /**
   * Lists all employees for the authenticated user's tenant with cursor pagination.
   */
  @Get()
  @RequirePermissions('hris.employee.view')
  @ApiOperation({ summary: 'List employees with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of employees.',
  })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Employee>> {
    return this.employeesService.findAll(req.user.tenantId!, paginationDto);
  }

  /**
   * Gets an employee by ID.
   */
  @Get(':id')
  @RequirePermissions('hris.employee.view')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns the employee.',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Employee> {
    return this.employeesService.findOne(id, req.user.tenantId!);
  }

  /**
   * Creates a new employee.
   */
  @Post()
  @RequirePermissions('hris.employee.manage')
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully.',
    type: Employee,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 409,
    description: 'Employee code or Email already exists.',
  })
  create(
    @Body() dto: CreateEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Employee> {
    return this.employeesService.create(dto, req.user.tenantId!);
  }

  /**
   * Updates an existing employee.
   */
  @Patch(':id')
  @RequirePermissions('hris.employee.manage')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully.',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Employee> {
    return this.employeesService.update(id, dto, req.user.tenantId!);
  }

  /**
   * Soft-deletes an employee.
   */
  @Delete(':id')
  @RequirePermissions('hris.employee.manage')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.employeesService.remove(id, req.user.tenantId!);
  }
}
