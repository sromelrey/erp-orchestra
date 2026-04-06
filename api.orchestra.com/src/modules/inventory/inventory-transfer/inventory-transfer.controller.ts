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
import { InventoryTransferService } from './inventory-transfer.service';
import {
  CreateStockTransferDto,
  UpdateStockTransferDto,
  FindStockTransferDto,
  ReceiveStockTransferDto,
} from './dto';

@ApiTags('Inventory - Stock Transfers')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('inv/stock-transfers')
export class InventoryTransferController {
  constructor(
    private readonly inventoryTransferService: InventoryTransferService,
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
    permission: 'inventory.transfer.create',
  })
  @ApiOperation({ summary: 'Create a new stock transfer' })
  async create(
    @Body() createStockTransferDto: CreateStockTransferDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.inventoryTransferService.create(
      createStockTransferDto,
      this.getActor(req),
    );
  }

  @Get()
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.read',
  })
  @ApiOperation({ summary: 'Get all stock transfers' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'transferNumber', required: false })
  @ApiQuery({ name: 'sourceWarehouseId', required: false })
  @ApiQuery({ name: 'destinationWarehouseId', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'transferDateFrom', required: false })
  @ApiQuery({ name: 'transferDateTo', required: false })
  async findAll(@Query() findStockTransferDto: FindStockTransferDto) {
    return this.inventoryTransferService.findAll(findStockTransferDto);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.read',
  })
  @ApiOperation({ summary: 'Get a stock transfer by ID' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async findOne(@Param('id') id: string) {
    return this.inventoryTransferService.findOne(+id);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.edit',
  })
  @ApiOperation({ summary: 'Update a stock transfer' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async update(
    @Param('id') id: string,
    @Body() updateStockTransferDto: UpdateStockTransferDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.inventoryTransferService.update(
      +id,
      updateStockTransferDto,
      this.getActor(req),
    );
  }

  @Patch(':id/approve')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.approve',
  })
  @ApiOperation({ summary: 'Approve a stock transfer' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async approve(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.inventoryTransferService.approve(+id, this.getActor(req));
  }

  @Patch(':id/ship')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.ship',
  })
  @ApiOperation({ summary: 'Mark a stock transfer as shipped' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async ship(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.inventoryTransferService.ship(+id, this.getActor(req));
  }

  @Patch(':id/receive')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.receive',
  })
  @ApiOperation({ summary: 'Receive a stock transfer' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async receive(
    @Param('id') id: string,
    @Body() receiveStockTransferDto: ReceiveStockTransferDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.inventoryTransferService.receive(
      +id,
      receiveStockTransferDto,
      this.getActor(req),
    );
  }

  @Patch(':id/cancel')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.cancel',
  })
  @ApiOperation({ summary: 'Cancel a stock transfer' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async cancel(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.inventoryTransferService.cancel(+id, this.getActor(req));
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'INVENTORY',
    permission: 'inventory.transfer.delete',
  })
  @ApiOperation({ summary: 'Delete a stock transfer' })
  @ApiParam({ name: 'id', description: 'Stock transfer ID' })
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.inventoryTransferService.remove(+id, this.getActor(req));
  }
}
