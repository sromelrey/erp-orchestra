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
import { ServiceOptionService } from '../services/service-option.service';
import { CreateServiceOptionDto } from '../dto/create-service-option.dto';
import { UpdateServiceOptionDto } from '../dto/update-service-option.dto';
import { ServiceOption } from '@/entities/service-config/service-option.entity';

class FindAllServiceOptionsDto {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

@ApiTags('Service Configuration')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, CombinedAccessGuard)
@Controller('service-config/service-options')
export class ServiceOptionController {
  constructor(private readonly serviceOptionService: ServiceOptionService) {}

  @Post()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_option.create',
  })
  @ApiOperation({
    summary: 'Create a new service option',
    description:
      'Creates a new service option record with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Service option created successfully',
    type: ServiceOption,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateServiceOptionDto })
  create(
    @Body() createServiceOptionDto: CreateServiceOptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceOptionService.create(createServiceOptionDto, actor);
  }

  @Get()
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_option.view',
  })
  @ApiOperation({
    summary: 'Retrieve all service options',
    description:
      'Get a paginated list of service options with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Service options retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ServiceOption' },
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
    @Query() query: FindAllServiceOptionsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceOptionService.findAll(actor, query);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_option.view',
  })
  @ApiOperation({
    summary: 'Retrieve a service option by ID',
    description: 'Get detailed information for a specific service option',
  })
  @ApiResponse({
    status: 200,
    description: 'Service option retrieved successfully',
    type: ServiceOption,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service option not found' })
  @ApiParam({ name: 'id', description: 'Service Option ID', example: 1 })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceOptionService.findOne(+id, actor);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_option.update',
  })
  @ApiOperation({
    summary: 'Update a service option',
    description: 'Update service option details partially',
  })
  @ApiResponse({
    status: 200,
    description: 'Service option updated successfully',
    type: ServiceOption,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service option not found' })
  @ApiParam({ name: 'id', description: 'Service Option ID', example: 1 })
  @ApiBody({ type: UpdateServiceOptionDto })
  update(
    @Param('id') id: string,
    @Body() updateServiceOptionDto: UpdateServiceOptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.serviceOptionService.update(+id, updateServiceOptionDto, actor);
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'SERVICE_CONFIG',
    permission: 'service_config.service_option.delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a service option',
    description: 'Soft-delete a service option (marks as deleted)',
  })
  @ApiResponse({
    status: 204,
    description: 'Service option deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service option not found' })
  @ApiParam({ name: 'id', description: 'Service Option ID', example: 1 })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.serviceOptionService.remove(+id, actor);
  }

  private getActor(req: AuthenticatedRequest) {
    return {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    };
  }
}
