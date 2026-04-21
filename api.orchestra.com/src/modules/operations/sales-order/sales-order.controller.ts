import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
  HttpCode,
  HttpStatus,
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
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderImportService } from './sales-order-import.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { ImportSalesOrdersDto } from './dto/import-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import {
  ConfirmSalesOrderDto,
  ShipSalesOrderDto,
  DeliverSalesOrderDto,
  CancelSalesOrderDto,
} from './dto/confirm-sales-order.dto';
import { SalesOrderQueryDto } from './dto/sales-order-query.dto';
import { SalesOrder } from '@/entities';

@ApiTags('Operations - Sales Orders')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops/sales-orders')
export class SalesOrderController {
  constructor(
    private readonly salesOrderService: SalesOrderService,
    private readonly salesOrderImportService: SalesOrderImportService,
  ) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  @Post('import')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.create',
  })
  @ApiOperation({
    summary: 'Bulk import sales orders from flat row data (e.g. Excel)',
  })
  @ApiResponse({ status: 200, description: 'Import result summary.' })
  @ApiBody({ type: ImportSalesOrdersDto })
  @HttpCode(HttpStatus.OK)
  importBulk(
    @Body() dto: ImportSalesOrdersDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderImportService.import(dto, this.getActor(req));
  }

  @Post()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.create',
  })
  @ApiOperation({ summary: 'Create a new sales order' })
  @ApiResponse({
    status: 201,
    description: 'Sales order created successfully.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateSalesOrderDto })
  create(
    @Body() createSalesOrderDto: CreateSalesOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.create(
      createSalesOrderDto,
      this.getActor(req),
    );
  }

  @Get()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.view',
  })
  @ApiOperation({ summary: 'Retrieve all sales orders' })
  @ApiResponse({ status: 200, description: 'List of sales orders.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'customerName', required: false })
  @ApiQuery({ name: 'orderNo', required: false })
  @ApiQuery({ name: 'orderDateFrom', required: false })
  @ApiQuery({ name: 'orderDateTo', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query() query: SalesOrderQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.findAll(query, this.getActor(req).tenantId);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.view',
  })
  @ApiOperation({ summary: 'Retrieve a specific sales order' })
  @ApiResponse({
    status: 200,
    description: 'Sales order details.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.findOne(id, this.getActor(req).tenantId);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.update',
  })
  @ApiOperation({ summary: 'Update a sales order' })
  @ApiResponse({
    status: 200,
    description: 'Sales order updated successfully.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  @ApiBody({ type: UpdateSalesOrderDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalesOrderDto: UpdateSalesOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.update(
      id,
      updateSalesOrderDto,
      this.getActor(req),
    );
  }

  @Post(':id/confirm')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.confirm',
  })
  @ApiOperation({ summary: 'Confirm a sales order and allocate stock' })
  @ApiResponse({
    status: 200,
    description: 'Sales order confirmed successfully.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 400, description: 'Cannot confirm order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  @ApiBody({ type: ConfirmSalesOrderDto })
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() confirmDto: ConfirmSalesOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.confirm(id, confirmDto, this.getActor(req));
  }

  @Post(':id/ship')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.ship',
  })
  @ApiOperation({ summary: 'Ship a sales order' })
  @ApiResponse({
    status: 200,
    description: 'Sales order shipped successfully.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 400, description: 'Cannot ship order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  @ApiBody({ type: ShipSalesOrderDto })
  ship(
    @Param('id', ParseIntPipe) id: number,
    @Body() shipDto: ShipSalesOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.ship(id, shipDto, this.getActor(req));
  }

  @Post(':id/deliver')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.deliver',
  })
  @ApiOperation({ summary: 'Deliver items for a sales order' })
  @ApiResponse({
    status: 200,
    description: 'Items delivered successfully.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 400, description: 'Cannot deliver items.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  @ApiBody({ type: DeliverSalesOrderDto })
  deliver(
    @Param('id', ParseIntPipe) id: number,
    @Body() deliverDto: DeliverSalesOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.deliver(id, deliverDto, this.getActor(req));
  }

  @Post(':id/cancel')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.cancel',
  })
  @ApiOperation({ summary: 'Cancel a sales order' })
  @ApiResponse({
    status: 200,
    description: 'Sales order cancelled successfully.',
    type: SalesOrder,
  })
  @ApiResponse({ status: 400, description: 'Cannot cancel order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  @ApiBody({ type: CancelSalesOrderDto })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelDto: CancelSalesOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.cancel(id, cancelDto, this.getActor(req));
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.sales-order.delete',
  })
  @ApiOperation({ summary: 'Delete a sales order (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Sales order deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Cannot delete order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Sales order not found.' })
  @ApiParam({ name: 'id', description: 'Sales order ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesOrderService.remove(id, this.getActor(req).tenantId);
  }
}
