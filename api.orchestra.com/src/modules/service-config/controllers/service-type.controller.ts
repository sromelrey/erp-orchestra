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
import { ServiceTypeService } from '../services/service-type.service';
import { CreateServiceTypeDto } from '../dto/create-service-type.dto';
import { UpdateServiceTypeDto } from '../dto/update-service-type.dto';
import { ServiceType } from '@/entities/service-config/service-type.entity';

class FindAllServiceTypesDto {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

@ApiTags('Service Configuration')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, CombinedAccessGuard)
@Controller('service-config/service-types')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Post()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_type.create',
  })
  @ApiOperation({
    summary: 'Create a new service type',
    description: 'Creates a new service type record with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Service type created successfully',
    type: ServiceType,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateServiceTypeDto })
  create(
    @Body() createServiceTypeDto: CreateServiceTypeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceTypeService.create(createServiceTypeDto, actor);
  }

  @Get()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_type.view',
  })
  @ApiOperation({
    summary: 'Retrieve all service types',
    description:
      'Get a paginated list of service types with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Service types retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ServiceType' },
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
    @Query() query: FindAllServiceTypesDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceTypeService.findAll(actor, query);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_type.view',
  })
  @ApiOperation({
    summary: 'Retrieve a service type by ID',
    description: 'Get detailed information for a specific service type',
  })
  @ApiResponse({
    status: 200,
    description: 'Service type retrieved successfully',
    type: ServiceType,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiParam({ name: 'id', description: 'Service Type ID', example: 1 })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceTypeService.findOne(+id, actor);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_type.update',
  })
  @ApiOperation({
    summary: 'Update a service type',
    description: 'Update service type details partially',
  })
  @ApiResponse({
    status: 200,
    description: 'Service type updated successfully',
    type: ServiceType,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiParam({ name: 'id', description: 'Service Type ID', example: 1 })
  @ApiBody({ type: UpdateServiceTypeDto })
  update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceTypeService.update(+id, updateServiceTypeDto, actor);
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_type.delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a service type',
    description: 'Soft-delete a service type (marks as deleted)',
  })
  @ApiResponse({
    status: 204,
    description: 'Service type deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  @ApiParam({ name: 'id', description: 'Service Type ID', example: 1 })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceTypeService.remove(+id, actor);
  }

  private getActor(req: AuthenticatedRequest) {
    return {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    };
  }
}
