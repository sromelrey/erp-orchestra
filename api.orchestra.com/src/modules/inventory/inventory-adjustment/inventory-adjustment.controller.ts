import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { InventoryAdjustmentService } from './inventory-adjustment.service';
import {
  CreateStockAdjustmentDto,
  UpdateStockAdjustmentDto,
  FindStockAdjustmentDto,
  ApproveStockAdjustmentDto,
} from './dto';

@ApiTags('Inventory - Stock Adjustments')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('inv/stock-adjustments')
export class InventoryAdjustmentController {
  constructor(
    private readonly inventoryAdjustmentService: InventoryAdjustmentService,
  ) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return {
      id: req.user.id,
      tenantId: req.user.tenantId,
    };
  }

  @Post()
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.create',
  })
  @ApiOperation({ summary: 'Create a new stock adjustment' })
  async create(
    @Body() createStockAdjustmentDto: CreateStockAdjustmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.inventoryAdjustmentService.create(
      createStockAdjustmentDto,
      this.getActor(req),
    );
  }

  @Get()
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.read',
  })
  @ApiOperation({ summary: 'Get all stock adjustments' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'adjustmentNumber', required: false })
  @ApiQuery({
    name: 'adjustmentType',
    required: false,
    enum: ['DAMAGE', 'LOSS', 'FOUND', 'COUNT'],
  })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'locationId', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'APPROVED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'adjustmentDateFrom', required: false })
  @ApiQuery({ name: 'adjustmentDateTo', required: false })
  async findAll(@Query() findStockAdjustmentDto: FindStockAdjustmentDto) {
    return this.inventoryAdjustmentService.findAll(findStockAdjustmentDto);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.read',
  })
  @ApiOperation({ summary: 'Get a stock adjustment by ID' })
  @ApiParam({ name: 'id', description: 'Stock adjustment ID' })
  async findOne(@Param('id') id: string) {
    return this.inventoryAdjustmentService.findOne(+id);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.edit',
  })
  @ApiOperation({ summary: 'Update a stock adjustment' })
  @ApiParam({ name: 'id', description: 'Stock adjustment ID' })
  async update(
    @Param('id') id: string,
    @Body() updateStockAdjustmentDto: UpdateStockAdjustmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.inventoryAdjustmentService.update(
      +id,
      updateStockAdjustmentDto,
      this.getActor(req),
    );
  }

  @Patch(':id/approve')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.approve',
  })
  @ApiOperation({ summary: 'Approve a stock adjustment' })
  @ApiParam({ name: 'id', description: 'Stock adjustment ID' })
  async approve(
    @Param('id') id: string,
    @Body() approveStockAdjustmentDto: ApproveStockAdjustmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.inventoryAdjustmentService.approve(
      +id,
      approveStockAdjustmentDto,
      this.getActor(req),
    );
  }

  @Patch(':id/cancel')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.cancel',
  })
  @ApiOperation({ summary: 'Cancel a stock adjustment' })
  @ApiParam({ name: 'id', description: 'Stock adjustment ID' })
  async cancel(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.inventoryAdjustmentService.cancel(+id, this.getActor(req));
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.adjustment.delete',
  })
  @ApiOperation({ summary: 'Delete a stock adjustment' })
  @ApiParam({ name: 'id', description: 'Stock adjustment ID' })
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.inventoryAdjustmentService.remove(+id, this.getActor(req));
  }
}
