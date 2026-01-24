import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SystemModulesService } from './system-modules.service';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
import { SystemModule } from '../../../entities/system/system-module.entity';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';
import { Roles } from '@/decorators/roles.decorator';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RolesGuard } from '@/guards/roles.guard';

/**
 * Controller for managing System Modules.
 *
 * Provides endpoints for CRUD operations on system modules.
 * Access is restricted to users with SUPER_ADMIN role.
 */
@ApiTags('System Modules')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('system-modules')
export class SystemModulesController {
  constructor(private readonly systemModulesService: SystemModulesService) {}

  /**
   * Creates a new system module.
   *
   * @param createSystemModuleDto - Data for creating the module
   * @returns The created module entity
   */
  @Post()
  @ApiOperation({ summary: 'Create a new system module' })
  @ApiResponse({
    status: 201,
    description: 'The module has been successfully created.',
    type: SystemModule,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateSystemModuleDto })
  create(
    @Body() createSystemModuleDto: CreateSystemModuleDto,
  ): Promise<SystemModule> {
    return this.systemModulesService.create(createSystemModuleDto);
  }

  /**
   * Retrieves a paginated list of system modules.
   *
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated result containing modules
   */
  @Get()
  @ApiOperation({ summary: 'List all system modules' })
  @ApiResponse({ status: 200, description: 'Return paginated modules.' })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<SystemModule>> {
    return this.systemModulesService.findAll(paginationDto);
  }

  /**
   * Retrieves a single module by ID.
   *
   * @param id - The unique identifier of the module
   * @returns The requested module entity
   * @throws {NotFoundException} If module is not found
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the module.',
    type: SystemModule,
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SystemModule> {
    return this.systemModulesService.findOne(id);
  }

  /**
   * Updates an existing module.
   *
   * @param id - The unique identifier of the module
   * @param updateSystemModuleDto - Data for updating the module
   * @returns The updated module entity
   * @throws {NotFoundException} If module is not found
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a module' })
  @ApiResponse({
    status: 200,
    description: 'The module has been successfully updated.',
    type: SystemModule,
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiBody({ type: UpdateSystemModuleDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSystemModuleDto: UpdateSystemModuleDto,
  ): Promise<SystemModule> {
    return this.systemModulesService.update(id, updateSystemModuleDto);
  }

  /**
   * Soft-deletes a module.
   *
   * @param id - The unique identifier of the module
   * @returns Void promise
   * @throws {NotFoundException} If module is not found
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft) a module' })
  @ApiResponse({
    status: 200,
    description: 'The module has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.systemModulesService.remove(id);
  }
}
