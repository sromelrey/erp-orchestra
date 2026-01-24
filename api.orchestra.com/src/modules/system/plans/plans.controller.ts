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
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from '../../../entities/system/plan.entity';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';
import { Roles } from '@/decorators/roles.decorator';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RolesGuard } from '@/guards/roles.guard';

/**
 * Controller for managing Subscription Plans.
 *
 * Provides endpoints for CRUD operations on plans.
 * Access is restricted to users with SUPER_ADMIN role.
 */
@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  /**
   * Creates a new plan.
   *
   * @param createPlanDto - Data for creating the plan
   * @returns The created plan entity
   */
  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'The plan has been successfully created.',
    type: Plan,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreatePlanDto })
  create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.plansService.create(createPlanDto);
  }

  /**
   * Retrieves a paginated list of plans.
   *
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated result containing plans
   */
  @Get()
  @ApiOperation({ summary: 'List all plans' })
  @ApiResponse({ status: 200, description: 'Return paginated plans.' })
  findAll(
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Plan>> {
    return this.plansService.findAll(paginationDto);
  }

  /**
   * Retrieves a single plan by ID.
   *
   * @param id - The unique identifier of the plan
   * @returns The requested plan entity
   * @throws {NotFoundException} If plan is not found
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiResponse({ status: 200, description: 'Return the plan.', type: Plan })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Plan> {
    return this.plansService.findOne(id);
  }

  /**
   * Updates an existing plan.
   *
   * @param id - The unique identifier of the plan
   * @param updatePlanDto - Data for updating the plan
   * @returns The updated plan entity
   * @throws {NotFoundException} If plan is not found
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully updated.',
    type: Plan,
  })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  @ApiBody({ type: UpdatePlanDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.plansService.update(id, updatePlanDto);
  }

  /**
   * Soft-deletes a plan.
   *
   * @param id - The unique identifier of the plan
   * @returns Void promise
   * @throws {NotFoundException} If plan is not found
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft) a plan' })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plansService.remove(id);
  }
}
