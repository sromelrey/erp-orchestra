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
import { PermissionsGuard } from '@/guards/permissions.guard';
import { MaterialMasterService } from './material-master.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';
import { Material } from '@/entities/inventory/material.entity';
import { MaterialType } from '@/types/enums';

@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('ops/materials')
export class MaterialMasterController {
  constructor(private readonly materialMasterService: MaterialMasterService) {}

  @Post()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.materials.create',
  })
  @ApiOperation({
    summary: 'Create a new material',
    description: 'Creates a new material record with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Material created successfully',
    type: Material,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
  @ApiBody({ type: CreateMaterialDto })
  create(
    @Body() createMaterialDto: CreateMaterialDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.materialMasterService.create(createMaterialDto, actor);
  }

  @Get()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.materials.view',
  })
  @ApiOperation({
    summary: 'Retrieve all materials',
    description: 'Get a paginated list of materials with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Materials retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Material' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'materialType',
    required: false,
    enum: MaterialType,
  })
  @ApiQuery({ name: 'materialGroup', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() query: QueryMaterialDto, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.materialMasterService.findAll(query, actor);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.materials.view',
  })
  @ApiOperation({
    summary: 'Retrieve a material by ID',
    description: 'Get detailed information for a specific material',
  })
  @ApiResponse({
    status: 200,
    description: 'Material retrieved successfully',
    type: Material,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  @ApiParam({ name: 'id', description: 'Material ID', example: 1 })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.materialMasterService.findOne(+id, actor);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.materials.update',
  })
  @ApiOperation({
    summary: 'Update a material',
    description: 'Update material details partially',
  })
  @ApiResponse({
    status: 200,
    description: 'Material updated successfully',
    type: Material,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
  @ApiParam({ name: 'id', description: 'Material ID', example: 1 })
  @ApiBody({ type: UpdateMaterialDto })
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.materialMasterService.update(+id, updateMaterialDto, actor);
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.materials.delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a material',
    description: 'Soft-delete a material (marks as deleted)',
  })
  @ApiResponse({ status: 204, description: 'Material deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  @ApiResponse({ status: 409, description: 'Material is referenced in BOMs' })
  @ApiParam({ name: 'id', description: 'Material ID', example: 1 })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.materialMasterService.remove(+id, actor);
  }

  private getActor(req: AuthenticatedRequest) {
    return {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    };
  }
}
