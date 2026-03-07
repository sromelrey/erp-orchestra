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
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Designation } from '@/entities/hris/designation.entity';
import { User } from '@/entities/system/user.entity';
import { PaginatedResult } from '@/types';

interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Controller for managing Designation resources.
 *
 * Provides CRUD endpoints for designations.
 * Access is controlled via slug-based permissions (hris.designation.view / hris.designation.manage).
 */
@ApiTags('HRIS - Designations')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  /**
   * Lists all designations for the authenticated user's tenant with cursor pagination.
   */
  @Get()
  @RequirePermissions('hris.designation.view')
  @ApiOperation({ summary: 'List designations with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of designations.',
  })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Designation>> {
    return this.designationService.findAll(req.user.tenantId!, paginationDto);
  }

  /**
   * Gets a designation by ID.
   */
  @Get(':id')
  @RequirePermissions('hris.designation.view')
  @ApiOperation({ summary: 'Get designation by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns the designation.',
    type: Designation,
  })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Designation> {
    return this.designationService.findOne(id, req.user.tenantId!);
  }

  /**
   * Creates a new designation.
   */
  @Post()
  @RequirePermissions('hris.designation.manage')
  @ApiOperation({ summary: 'Create a new designation' })
  @ApiBody({ type: CreateDesignationDto })
  @ApiResponse({
    status: 201,
    description: 'Designation created successfully.',
    type: Designation,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(
    @Body() dto: CreateDesignationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Designation> {
    return this.designationService.create(dto, req.user.tenantId!);
  }

  /**
   * Updates an existing designation.
   */
  @Patch(':id')
  @RequirePermissions('hris.designation.manage')
  @ApiOperation({ summary: 'Update a designation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDesignationDto })
  @ApiResponse({
    status: 200,
    description: 'Designation updated successfully.',
    type: Designation,
  })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDesignationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Designation> {
    return this.designationService.update(id, dto, req.user.tenantId!);
  }

  /**
   * Soft-deletes a designation.
   */
  @Delete(':id')
  @RequirePermissions('hris.designation.manage')
  @ApiOperation({ summary: 'Delete a designation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Designation deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.designationService.remove(id, req.user.tenantId!);
  }
}
