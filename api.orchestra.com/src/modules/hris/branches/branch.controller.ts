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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Branch } from '@/entities/hris/branch.entity';
import { User } from '@/entities/system/user.entity';
import { PaginatedResult } from '@/types';

interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Controller for managing Branch resources.
 *
 * Provides CRUD endpoints for branches.
 * Access is controlled via slug-based permissions (hris.branch.view / hris.branch.manage).
 */
@ApiTags('HRIS - Branches')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  /**
   * Lists all branches for the authenticated user's tenant with cursor pagination.
   */
  @Get()
  @RequirePermissions('hris.branch.view')
  @ApiOperation({ summary: 'List branches with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of branches.',
  })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Branch>> {
    return this.branchService.findAll(req.user.tenantId!, paginationDto);
  }

  /**
   * Gets a branch by ID.
   */
  @Get(':id')
  @RequirePermissions('hris.branch.view')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns the branch.',
    type: Branch,
  })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Branch> {
    return this.branchService.findOne(id, req.user.tenantId!);
  }

  /**
   * Creates a new branch.
   */
  @Post()
  @RequirePermissions('hris.branch.manage')
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({ type: CreateBranchDto })
  @ApiResponse({
    status: 201,
    description: 'Branch created successfully.',
    type: Branch,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(
    @Body() dto: CreateBranchDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Branch> {
    return this.branchService.create(dto, req.user.tenantId!);
  }

  /**
   * Updates an existing branch.
   */
  @Patch(':id')
  @RequirePermissions('hris.branch.manage')
  @ApiOperation({ summary: 'Update a branch' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateBranchDto })
  @ApiResponse({
    status: 200,
    description: 'Branch updated successfully.',
    type: Branch,
  })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBranchDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Branch> {
    return this.branchService.update(id, dto, req.user.tenantId!);
  }

  /**
   * Soft-deletes a branch.
   */
  @Delete(':id')
  @RequirePermissions('hris.branch.manage')
  @ApiOperation({ summary: 'Delete a branch' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Branch deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.branchService.remove(id, req.user.tenantId!);
  }
}
