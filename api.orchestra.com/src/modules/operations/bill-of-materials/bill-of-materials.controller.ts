import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { BillOfMaterialsService } from './bill-of-materials.service';
import {
  CreateBomDto,
  UpdateBomDto,
  UpdateBomStatusDto,
  ListBomDto,
} from './dto';

@ApiTags('Operations - Bill of Materials')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops/bom')
export class BillOfMaterialsController {
  constructor(private readonly service: BillOfMaterialsService) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  @Post()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.manage',
  })
  @ApiOperation({ summary: 'Create BOM' })
  async create(@Body() dto: CreateBomDto, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.create(dto, actor);
  }

  @Get()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.view',
  })
  @ApiOperation({ summary: 'List BOMs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'parentMaterialId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  async findAll(@Query() query: ListBomDto, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.findAll(query, actor.tenantId);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.view',
  })
  @ApiOperation({ summary: 'Get BOM by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.findOne(id, actor.tenantId);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.manage',
  })
  @ApiOperation({ summary: 'Update BOM' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBomDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.update(id, dto, actor);
  }

  @Patch(':id/status')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.manage',
  })
  @ApiOperation({ summary: 'Update BOM status' })
  @ApiParam({ name: 'id', type: Number })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBomStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateStatus(id, dto, actor);
  }

  @Post(':id/deactivate')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.manage',
  })
  @ApiOperation({ summary: 'Deactivate BOM' })
  @ApiParam({ name: 'id', type: Number })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateStatus(id, { isActive: false }, actor);
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.manage',
  })
  @ApiOperation({ summary: 'Delete BOM' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.remove(id, actor);
  }

  @Get('item/:itemId/active')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.view',
  })
  @ApiOperation({ summary: 'Get active BOM for item' })
  @ApiParam({ name: 'itemId', type: Number })
  getActiveForItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.getActiveForItem(itemId, actor.tenantId);
  }

  @Get(':id/cost')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.view',
  })
  @ApiOperation({ summary: 'Calculate BOM cost' })
  @ApiParam({ name: 'id', type: Number })
  calculateCost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.calculateCost(id, actor.tenantId);
  }

  @Get(':id/cost/breakdown')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.view',
  })
  @ApiOperation({ summary: 'Get BOM cost breakdown' })
  @ApiParam({ name: 'id', type: Number })
  calculateCostBreakdown(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.calculateCost(id, actor.tenantId);
  }

  @Get('component/:componentId/where-used')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.bom.view',
  })
  @ApiOperation({ summary: 'Get where used (implosion)' })
  @ApiParam({ name: 'componentId', type: Number })
  getWhereUsed(
    @Param('componentId', ParseIntPipe) componentId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.getWhereUsed(componentId, actor.tenantId);
  }
}
