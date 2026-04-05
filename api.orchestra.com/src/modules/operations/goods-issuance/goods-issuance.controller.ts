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
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GoodsIssuanceService } from './goods-issuance.service';
import { CreateGoodsIssuanceDto } from './dto/create-goods-issuance.dto';
import { UpdateGoodsIssuanceDto } from './dto/update-goods-issuance.dto';
import { ApproveGoodsIssuanceDto } from './dto/approve-goods-issuance.dto';
import { FindGoodsIssuanceDto } from './dto/find-goods-issuance.dto';
import { GoodsIssuance } from '@/entities/operations/goods-issuance.entity';
import {
  GoodsIssuanceStatus,
  GoodsIssuanceType,
} from '@/entities/operations/goods-issuance.entity';
import { User } from '@/entities/system/user.entity';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';

interface RequestWithUser {
  user: User;
}

@ApiTags('Goods Issuance')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('ops/goods-issuance')
export class GoodsIssuanceController {
  constructor(private readonly goodsIssuanceService: GoodsIssuanceService) {}

  @Post()
  @RequirePermissions('goods-issuance.create')
  @ApiOperation({ summary: 'Create a new goods issuance' })
  @ApiResponse({
    status: 201,
    description: 'Goods issuance created successfully.',
    type: GoodsIssuance,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateGoodsIssuanceDto })
  create(
    @Body() createGoodsIssuanceDto: CreateGoodsIssuanceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.goodsIssuanceService.create(createGoodsIssuanceDto, req.user);
  }

  @Get()
  @RequirePermissions('goods-issuance.view')
  @ApiOperation({ summary: 'List all goods issuances with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of goods issuances retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'issuanceType', required: false, type: String })
  @ApiQuery({ name: 'warehouseId', required: false, type: Number })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('issuanceType') issuanceType?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: FindGoodsIssuanceDto = {
      status: status as GoodsIssuanceStatus,
      issuanceType: issuanceType as GoodsIssuanceType,
      warehouseId: warehouseId ? +warehouseId : undefined,
      dateFrom,
      dateTo,
    };
    const [data, total] = await this.goodsIssuanceService.findAll(
      page ? +page : 1,
      limit ? +limit : 20,
      filters,
    );

    return {
      data,
      total,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      totalPages: Math.ceil(total / (limit ? +limit : 20)),
    };
  }

  @Get(':id')
  @RequirePermissions('goods-issuance.view')
  @ApiOperation({ summary: 'Retrieve a goods issuance by ID' })
  @ApiResponse({
    status: 200,
    description: 'Goods issuance found.',
    type: GoodsIssuance,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Goods issuance not found.' })
  findOne(@Param('id') id: string) {
    return this.goodsIssuanceService.findOne(+id);
  }

  @Get('number/:issuanceNumber')
  @RequirePermissions('goods-issuance.view')
  @ApiOperation({ summary: 'Retrieve a goods issuance by number' })
  @ApiResponse({
    status: 200,
    description: 'Goods issuance found.',
    type: GoodsIssuance,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Goods issuance not found.' })
  findByNumber(@Param('issuanceNumber') issuanceNumber: string) {
    return this.goodsIssuanceService.findByNumber(issuanceNumber);
  }

  @Patch(':id')
  @RequirePermissions('goods-issuance.update')
  @ApiOperation({ summary: 'Update a goods issuance' })
  @ApiResponse({
    status: 200,
    description: 'Goods issuance updated successfully.',
    type: GoodsIssuance,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or issuance not in DRAFT status.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Goods issuance not found.' })
  @ApiBody({ type: UpdateGoodsIssuanceDto })
  update(
    @Param('id') id: string,
    @Body() updateGoodsIssuanceDto: UpdateGoodsIssuanceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.goodsIssuanceService.update(
      +id,
      updateGoodsIssuanceDto,
      req.user,
    );
  }

  @Post(':id/approve')
  @RequirePermissions('goods-issuance.approve')
  @ApiOperation({ summary: 'Approve a goods issuance' })
  @ApiResponse({
    status: 200,
    description: 'Goods issuance approved successfully.',
    type: GoodsIssuance,
  })
  @ApiResponse({ status: 400, description: 'Cannot approve issuance.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Goods issuance not found.' })
  @ApiResponse({ status: 409, description: 'Insufficient stock.' })
  @ApiBody({ type: ApproveGoodsIssuanceDto })
  approve(
    @Param('id') id: string,
    @Body() approveDto: ApproveGoodsIssuanceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.goodsIssuanceService.approve(+id, approveDto, req.user);
  }

  @Post(':id/cancel')
  @RequirePermissions('goods-issuance.cancel')
  @ApiOperation({ summary: 'Cancel a goods issuance' })
  @ApiResponse({
    status: 200,
    description: 'Goods issuance cancelled successfully.',
    type: GoodsIssuance,
  })
  @ApiResponse({ status: 400, description: 'Cannot cancel issuance.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Goods issuance not found.' })
  cancel(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.goodsIssuanceService.cancel(+id, req.user);
  }

  @Delete(':id')
  @RequirePermissions('goods-issuance.delete')
  @ApiOperation({ summary: 'Delete a goods issuance' })
  @ApiResponse({
    status: 204,
    description: 'Goods issuance deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Cannot delete issuance.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Goods issuance not found.' })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.goodsIssuanceService.remove(+id, req.user);
  }
}
