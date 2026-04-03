import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  Req,
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
import { GoodsReceiptService } from './goods-receipt.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { ConfirmGoodsReceiptDto } from './dto/confirm-goods-receipt.dto';
import { GoodsReceipt } from '@/entities';

@ApiTags('Operations - Goods Receipt')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops/goods-receipt')
export class GoodsReceiptController {
  constructor(private readonly goodsReceiptService: GoodsReceiptService) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  @Post()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.create',
  })
  @ApiOperation({
    summary: 'Create a new goods receipt',
    description: 'Creates a new goods receipt in DRAFT status with line items',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Goods receipt created successfully',
    type: GoodsReceipt,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiBody({ type: CreateGoodsReceiptDto })
  create(
    @Body() createGoodsReceiptDto: CreateGoodsReceiptDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.goodsReceiptService.create(createGoodsReceiptDto, actor);
  }

  @Get()
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.view',
  })
  @ApiOperation({
    summary: 'List all goods receipts',
    description:
      'Retrieve paginated list of goods receipts with optional filtering',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Goods receipts retrieved successfully',
    type: [GoodsReceipt],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'CONFIRMED', 'CANCELLED'],
  })
  @ApiQuery({
    name: 'receiptType',
    required: false,
    enum: ['PURCHASE_ORDER', 'PRODUCTION', 'RETURN', 'MANUAL'],
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('receiptType') receiptType?: string,
  ) {
    return this.goodsReceiptService.findAll({
      page,
      limit,
      status,
      receiptType,
    });
  }

  @Get(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.view',
  })
  @ApiOperation({
    summary: 'Get goods receipt by ID',
    description: 'Retrieve a specific goods receipt with its line items',
  })
  @ApiParam({ name: 'id', description: 'Goods receipt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Goods receipt retrieved successfully',
    type: GoodsReceipt,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Goods receipt not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.goodsReceiptService.findOne(id);
  }

  @Get('number/:receiptNumber')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.view',
  })
  @ApiOperation({
    summary: 'Get goods receipt by receipt number',
    description:
      'Retrieve a specific goods receipt using its unique receipt number',
  })
  @ApiParam({ name: 'receiptNumber', description: 'Goods receipt number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Goods receipt retrieved successfully',
    type: GoodsReceipt,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Goods receipt not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  findByReceiptNumber(@Param('receiptNumber') receiptNumber: string) {
    return this.goodsReceiptService.findByReceiptNumber(receiptNumber);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.update',
  })
  @ApiOperation({
    summary: 'Update goods receipt',
    description:
      'Update goods receipt details (only DRAFT status can be updated)',
  })
  @ApiParam({ name: 'id', description: 'Goods receipt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Goods receipt updated successfully',
    type: GoodsReceipt,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or receipt not in DRAFT status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Goods receipt not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiBody({ type: UpdateGoodsReceiptDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGoodsReceiptDto: UpdateGoodsReceiptDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.goodsReceiptService.update(id, updateGoodsReceiptDto, actor);
  }

  @Post(':id/confirm')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.confirm',
  })
  @ApiOperation({
    summary: 'Confirm goods receipt',
    description:
      'Confirm a DRAFT goods receipt, which creates stock movements and updates inventory',
  })
  @ApiParam({ name: 'id', description: 'Goods receipt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Goods receipt confirmed successfully',
    type: GoodsReceipt,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Receipt not in DRAFT status or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Goods receipt not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiBody({ type: ConfirmGoodsReceiptDto })
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() confirmDto: ConfirmGoodsReceiptDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.goodsReceiptService.confirm(id, confirmDto, actor);
  }

  @Post(':id/cancel')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.goods-receipt.cancel',
  })
  @ApiOperation({
    summary: 'Cancel goods receipt',
    description: 'Cancel a goods receipt (only DRAFT status can be cancelled)',
  })
  @ApiParam({ name: 'id', description: 'Goods receipt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Goods receipt cancelled successfully',
    type: GoodsReceipt,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Receipt not in DRAFT status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Goods receipt not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.goodsReceiptService.cancel(id, actor);
  }
}
