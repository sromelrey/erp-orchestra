import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { WarehousesService, LocationTreeNode } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { CreateWarehouseLocationDto } from './dto/create-location.dto';
import { UpdateWarehouseLocationDto } from './dto/update-location.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@ApiTags('Operations - Warehouses')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  // Warehouses
  @Post('warehouses')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiOperation({ summary: 'Create warehouse' })
  createWarehouse(
    @Body() dto: CreateWarehouseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.createWarehouse(dto, actor);
  }

  @Get('warehouses')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiOperation({ summary: 'List warehouses' })
  listWarehouses(@Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.findWarehouses(actor.tenantId);
  }

  @Get('warehouses/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'id', type: Number })
  getWarehouse(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.findOneWarehouse(id, actor.tenantId);
  }

  @Get('warehouses/:id/capacity')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'id', type: Number })
  getWarehouseCapacity(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.getWarehouseCapacity(id, actor.tenantId);
  }

  @Patch('warehouses/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'id', type: Number })
  updateWarehouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWarehouseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateWarehouse(id, dto, actor);
  }

  // Locations
  @Post('warehouses/:warehouseId/locations')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'warehouseId', type: Number })
  createLocation(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() dto: CreateWarehouseLocationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.createLocation(warehouseId, dto, actor);
  }

  @Get('warehouses/:warehouseId/locations')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'warehouseId', type: Number })
  listLocations(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.listLocations(warehouseId, actor.tenantId);
  }

  @Get('warehouses/:warehouseId/locations/tree')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'warehouseId', type: Number })
  getLocationTree(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<LocationTreeNode[]> {
    const actor = this.getActor(req);
    return this.service.getLocationTree(warehouseId, actor.tenantId);
  }

  @Patch('warehouses/:warehouseId/locations/:locationId')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.warehouse.manage',
  })
  @ApiParam({ name: 'warehouseId', type: Number })
  @ApiParam({ name: 'locationId', type: Number })
  updateLocation(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: UpdateWarehouseLocationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateLocation(warehouseId, locationId, dto, actor);
  }

  // Stock movements
  @Post('stock-ledger')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.stock.manage',
  })
  @ApiOperation({ summary: 'Record stock movement' })
  recordMovement(
    @Body() dto: CreateStockMovementDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.recordMovement(dto, actor);
  }

  @Get('stock-ledger')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.stock.view',
  })
  @ApiOperation({ summary: 'List recent stock ledger entries' })
  listLedger(@Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.findLedgerEntries(actor.tenantId);
  }
}
