import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { CombinedAccessGuard } from '@/guards/combined-access.guard';
import { ServiceConditionService } from '../services/service-condition.service';
import { CreateServiceConditionDto } from '../dto/create-service-condition.dto';
import { UpdateServiceConditionDto } from '../dto/update-service-condition.dto';
import { ServiceCondition } from '@/entities/service-config/service-condition.entity';

class FindAllServiceConditionsDto {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

@ApiTags('Service Configuration')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, CombinedAccessGuard)
@Controller('service-config/service-conditions')
export class ServiceConditionController {
  constructor(
    private readonly serviceConditionService: ServiceConditionService,
  ) {}

  @Post()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_condition.create',
  })
  @ApiOperation({
    summary: 'Create a new service condition',
    description:
      'Creates a new service condition record with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Service condition created successfully',
    type: ServiceCondition,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateServiceConditionDto })
  create(
    @Body() createServiceConditionDto: CreateServiceConditionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceConditionService.create(
      createServiceConditionDto,
      actor,
    );
  }

  @Get()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_condition.view',
  })
  @ApiOperation({
    summary: 'Retrieve all service conditions',
    description:
      'Get a paginated list of service conditions with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Service conditions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ServiceCondition' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(
    @Query() query: FindAllServiceConditionsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceConditionService.findAll(actor, query);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_condition.view',
  })
  @ApiOperation({
    summary: 'Retrieve a service condition by ID',
    description: 'Get detailed information for a specific service condition',
  })
  @ApiResponse({
    status: 200,
    description: 'Service condition retrieved successfully',
    type: ServiceCondition,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service condition not found' })
  @ApiParam({ name: 'id', description: 'Service Condition ID', example: 1 })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceConditionService.findOne(+id, actor);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_condition.update',
  })
  @ApiOperation({
    summary: 'Update a service condition',
    description: 'Update service condition details partially',
  })
  @ApiResponse({
    status: 200,
    description: 'Service condition updated successfully',
    type: ServiceCondition,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service condition not found' })
  @ApiParam({ name: 'id', description: 'Service Condition ID', example: 1 })
  @ApiBody({ type: UpdateServiceConditionDto })
  update(
    @Param('id') id: string,
    @Body() updateServiceConditionDto: UpdateServiceConditionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceConditionService.update(
      +id,
      updateServiceConditionDto,
      actor,
    );
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_condition.delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a service condition',
    description: 'Soft-delete a service condition (marks as deleted)',
  })
  @ApiResponse({
    status: 204,
    description: 'Service condition deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service condition not found' })
  @ApiParam({ name: 'id', description: 'Service Condition ID', example: 1 })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceConditionService.remove(+id, actor);
  }

  private getActor(req: AuthenticatedRequest) {
    return {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    };
  }
}
