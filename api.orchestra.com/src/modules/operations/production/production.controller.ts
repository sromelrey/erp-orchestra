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
import {
  ProductionService,
  ProductionBatchFilters,
} from './production.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ProductionBatchQueryDto } from './dto/production-batch-query.dto';
import { ProductionBatch } from '@/entities';

@ApiTags('Operations - Production')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops/production-batches')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  @Post()
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.create',
  })
  @ApiOperation({ summary: 'Create a new production batch' })
  @ApiResponse({
    status: 201,
    description: 'Production batch created successfully.',
    type: ProductionBatch,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateProductionBatchDto })
  create(
    @Body() createProductionBatchDto: CreateProductionBatchDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.create(
      createProductionBatchDto,
      this.getActor(req),
    );
  }

  @Get()
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.view',
  })
  @ApiOperation({ summary: 'Retrieve all production batches' })
  @ApiResponse({ status: 200, description: 'List of production batches.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'batchNo', required: false })
  @ApiQuery({ name: 'startDateFrom', required: false })
  @ApiQuery({ name: 'startDateTo', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query() query: ProductionBatchQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const filters: ProductionBatchFilters = {
      ...query,
      startDateFrom: query.startDateFrom
        ? new Date(query.startDateFrom)
        : undefined,
      startDateTo: query.startDateTo ? new Date(query.startDateTo) : undefined,
    };
    return this.productionService.findAll(filters, this.getActor(req).tenantId);
  }

  @Get(':id')
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.view',
  })
  @ApiOperation({ summary: 'Retrieve a specific production batch' })
  @ApiResponse({
    status: 200,
    description: 'Production batch details.',
    type: ProductionBatch,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Production batch not found.' })
  @ApiParam({ name: 'id', description: 'Production batch ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.findOne(id, this.getActor(req).tenantId);
  }

  @Patch(':id')
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.update',
  })
  @ApiOperation({ summary: 'Update a production batch' })
  @ApiResponse({
    status: 200,
    description: 'Production batch updated successfully.',
    type: ProductionBatch,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Production batch not found.' })
  @ApiParam({ name: 'id', description: 'Production batch ID' })
  @ApiBody({ type: UpdateProductionBatchDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductionBatchDto: UpdateProductionBatchDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.update(
      id,
      updateProductionBatchDto,
      this.getActor(req),
    );
  }

  @Post(':id/start')
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.start',
  })
  @ApiOperation({ summary: 'Start a production batch' })
  @ApiResponse({
    status: 200,
    description: 'Production batch started successfully.',
    type: ProductionBatch,
  })
  @ApiResponse({ status: 400, description: 'Cannot start batch.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Production batch not found.' })
  @ApiParam({ name: 'id', description: 'Production batch ID' })
  start(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.start(id, this.getActor(req));
  }

  @Post(':id/complete')
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.complete',
  })
  @ApiOperation({ summary: 'Complete a production batch' })
  @ApiResponse({
    status: 200,
    description: 'Production batch completed successfully.',
    type: ProductionBatch,
  })
  @ApiResponse({ status: 400, description: 'Cannot complete batch.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Production batch not found.' })
  @ApiParam({ name: 'id', description: 'Production batch ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        actualQuantity: {
          type: 'number',
          description: 'Actual quantity produced',
        },
      },
      required: ['actualQuantity'],
    },
  })
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { actualQuantity: number },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.complete(
      id,
      body.actualQuantity,
      this.getActor(req),
    );
  }

  @Post(':id/cancel')
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.delete',
  })
  @ApiOperation({ summary: 'Cancel a production batch' })
  @ApiResponse({
    status: 200,
    description: 'Production batch cancelled successfully.',
    type: ProductionBatch,
  })
  @ApiResponse({ status: 400, description: 'Cannot cancel batch.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Production batch not found.' })
  @ApiParam({ name: 'id', description: 'Production batch ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Reason for cancellation',
        },
      },
      required: ['reason'],
    },
  })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.cancel(id, body.reason, this.getActor(req));
  }

  @Delete(':id')
  @RequireAccess({
    feature: 'PRODUCTION',
    permission: 'production.batch.delete',
  })
  @ApiOperation({ summary: 'Delete a production batch (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Production batch deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Cannot delete batch.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Production batch not found.' })
  @ApiParam({ name: 'id', description: 'Production batch ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productionService.remove(id, this.getActor(req).tenantId);
  }
}
