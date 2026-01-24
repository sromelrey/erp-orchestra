import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { Tenant } from '../../../entities/system/tenant.entity';
import { PaginatedResult } from '@/types';
import { Roles } from '@/decorators/roles.decorator';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RolesGuard } from '@/guards/roles.guard';

/**
 * Controller for managing Tenant resources.
 *
 * Provides endpoints for CRUD operations on tenants.
 * Access is restricted to users with SUPER_ADMIN role.
 */
@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  /**
   * Creates a new tenant.
   *
   * @param createTenantDto - Data for creating the tenant
   * @returns The created tenant entity
   */
  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({
    status: 201,
    description: 'The tenant has been successfully created.',
    type: Tenant,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateTenantDto })
  create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantsService.create(createTenantDto);
  }

  /**
   * Retrieves a paginated list of tenants.
   *
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated result containing tenants and next cursor
   */
  @Get()
  @ApiOperation({ summary: 'List all tenants with cursor pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated tenants.' })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Tenant>> {
    return this.tenantsService.findAll(paginationDto);
  }

  /**
   * Retrieves a single tenant by ID.
   *
   * @param id - The unique identifier of the tenant
   * @returns The requested tenant entity
   * @throws {NotFoundException} If tenant is not found
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Return the tenant.', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tenant> {
    return this.tenantsService.findOne(id);
  }

  /**
   * Updates an existing tenant.
   *
   * @param id - The unique identifier of the tenant
   * @param updateTenantDto - Data for updating the tenant
   * @returns The updated tenant entity
   * @throws {NotFoundException} If tenant is not found
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tenant' })
  @ApiResponse({
    status: 200,
    description: 'The tenant has been successfully updated.',
    type: Tenant,
  })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  @ApiBody({ type: UpdateTenantDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    return this.tenantsService.update(id, updateTenantDto);
  }

  /**
   * Soft-deletes a tenant.
   *
   * @param id - The unique identifier of the tenant
   * @returns Void promise
   * @throws {NotFoundException} If tenant is not found
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft) a tenant' })
  @ApiResponse({
    status: 200,
    description: 'The tenant has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tenantsService.remove(id);
  }
}
