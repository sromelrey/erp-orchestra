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
import { ServiceConfigurationService } from '../services/service-configuration.service';
import { CreateServiceConfigurationDto } from '../dto/create-service-configuration.dto';
import { UpdateServiceConfigurationDto } from '../dto/update-service-configuration.dto';
import { ServiceConfiguration } from '@/entities/service-config/service-configuration.entity';

class FindAllServiceConfigurationsDto {
  page?: number;
  limit?: number;
  serviceTypeId?: number;
  serviceOptionId?: number;
  isActive?: boolean;
}

class LookupServiceConfigurationDto {
  service_type_id: string;
  service_option_id: string;
  condition_key?: string;
  condition_value?: string;
}

@ApiTags('Service Configuration')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, CombinedAccessGuard)
@Controller('service-config/service-configurations')
export class ServiceConfigurationController {
  constructor(
    private readonly serviceConfigurationService: ServiceConfigurationService,
  ) {}

  @Post()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.create',
  })
  @ApiOperation({
    summary: 'Create a new service configuration',
    description:
      'Creates a new service configuration record with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Service configuration created successfully',
    type: ServiceConfiguration,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateServiceConfigurationDto })
  create(
    @Body() createServiceConfigurationDto: CreateServiceConfigurationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceConfigurationService.create(
      createServiceConfigurationDto,
      actor,
    );
  }

  @Get()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.view',
  })
  @ApiOperation({
    summary: 'Retrieve all service configurations',
    description:
      'Get a paginated list of service configurations with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Service configurations retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ServiceConfiguration' },
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
  @ApiQuery({ name: 'serviceTypeId', required: false })
  @ApiQuery({ name: 'serviceOptionId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(
    @Query() query: FindAllServiceConfigurationsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceConfigurationService.findAll(actor, query);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.view',
  })
  @ApiOperation({
    summary: 'Retrieve a service configuration by ID',
    description:
      'Get detailed information for a specific service configuration',
  })
  @ApiResponse({
    status: 200,
    description: 'Service configuration retrieved successfully',
    type: ServiceConfiguration,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service configuration not found' })
  @ApiParam({ name: 'id', description: 'Service Configuration ID', example: 1 })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceConfigurationService.findOne(+id, actor);
  }

  @Get('lookup')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.view',
  })
  @ApiOperation({
    summary: 'Lookup service configuration',
    description:
      'Find matching configuration based on service type, option, and conditions',
  })
  @ApiResponse({
    status: 200,
    description: 'Service configuration found',
    type: ServiceConfiguration,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No matching configuration found' })
  @ApiQuery({ name: 'service_type_id', required: true, example: 1 })
  @ApiQuery({ name: 'service_option_id', required: true, example: 1 })
  @ApiQuery({ name: 'condition_key', required: false })
  @ApiQuery({ name: 'condition_value', required: false })
  async lookup(
    @Query() query: LookupServiceConfigurationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    const {
      service_type_id,
      service_option_id,
      condition_key,
      condition_value,
    } = query;

    return this.serviceConfigurationService.findMatchingConfiguration(
      actor.tenantId,
      Number(service_type_id),
      Number(service_option_id),
      condition_key,
      condition_value,
    );
  }

  @Get('price')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.view',
  })
  @ApiOperation({
    summary: 'Get price for service configuration',
    description:
      'Quick lookup to get the price and service names for a given service type and option',
  })
  @ApiResponse({
    status: 200,
    description: 'Price retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        price: { type: 'number' },
        serviceTypeName: { type: 'string' },
        serviceOptionName: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'No matching configuration found' })
  @ApiQuery({ name: 'service_type_id', required: true, example: 1 })
  @ApiQuery({ name: 'service_option_id', required: true, example: 1 })
  async getPrice(
    @Query('service_type_id') serviceTypeId: string,
    @Query('service_option_id') serviceOptionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return await this.serviceConfigurationService.getPrice(
      actor.tenantId,
      Number(serviceTypeId),
      Number(serviceOptionId),
    );
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.update',
  })
  @ApiOperation({
    summary: 'Update a service configuration',
    description: 'Update service configuration details partially',
  })
  @ApiResponse({
    status: 200,
    description: 'Service configuration updated successfully',
    type: ServiceConfiguration,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service configuration not found' })
  @ApiParam({ name: 'id', description: 'Service Configuration ID', example: 1 })
  @ApiBody({ type: UpdateServiceConfigurationDto })
  update(
    @Param('id') id: string,
    @Body() updateServiceConfigurationDto: UpdateServiceConfigurationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceConfigurationService.update(
      +id,
      updateServiceConfigurationDto,
      actor,
    );
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_configuration.delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a service configuration',
    description: 'Soft-delete a service configuration (marks as deleted)',
  })
  @ApiResponse({
    status: 204,
    description: 'Service configuration deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service configuration not found' })
  @ApiParam({ name: 'id', description: 'Service Configuration ID', example: 1 })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceConfigurationService.remove(+id, actor);
  }

  private getActor(req: AuthenticatedRequest) {
    return {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    };
  }
}
