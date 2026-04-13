import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { OperationsDashboardService } from './operations-dashboard.service';
import {
  DashboardOverviewDto,
  SalesOverviewDto,
  InventoryOverviewDto,
  ProductionOverviewDto,
  MaterialsOverviewDto,
} from './dto/dashboard-overview.dto';
import { BusinessMetricsDto } from './dto/business-metrics.dto';

@ApiTags('Operations - Dashboard')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops/dashboard')
export class OperationsDashboardController {
  constructor(
    private readonly operationsDashboardService: OperationsDashboardService,
  ) {}

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  @Get('overview')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.dashboard.view',
  })
  @ApiOperation({
    summary: 'Get complete dashboard overview',
    description: 'Returns aggregated statistics from all operations modules',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview retrieved successfully',
    type: DashboardOverviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getOverview(@Req() req: AuthenticatedRequest) {
    const { tenantId } = this.getActor(req);
    return this.operationsDashboardService.getDashboardOverview(tenantId);
  }

  @Get('sales')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.dashboard.view',
  })
  @ApiOperation({
    summary: 'Get sales overview statistics',
    description: 'Returns sales order statistics by status and revenue',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales overview retrieved successfully',
    type: SalesOverviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getSalesOverview(@Req() req: AuthenticatedRequest) {
    const { tenantId } = this.getActor(req);
    return this.operationsDashboardService.getSalesOverview(tenantId);
  }

  @Get('inventory')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.dashboard.view',
  })
  @ApiOperation({
    summary: 'Get inventory overview statistics',
    description:
      'Returns inventory metrics including stock value and low stock alerts',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory overview retrieved successfully',
    type: InventoryOverviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getInventoryOverview() {
    return this.operationsDashboardService.getInventoryOverview();
  }

  @Get('production')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.dashboard.view',
  })
  @ApiOperation({
    summary: 'Get production overview statistics',
    description: 'Returns production batch metrics and completion rates',
  })
  @ApiResponse({
    status: 200,
    description: 'Production overview retrieved successfully',
    type: ProductionOverviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getProductionOverview(@Req() req: AuthenticatedRequest) {
    const { tenantId } = this.getActor(req);
    return this.operationsDashboardService.getProductionOverview(tenantId);
  }

  @Get('materials')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.dashboard.view',
  })
  @ApiOperation({
    summary: 'Get materials overview statistics',
    description: 'Returns material counts by type',
  })
  @ApiResponse({
    status: 200,
    description: 'Materials overview retrieved successfully',
    type: MaterialsOverviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMaterialsOverview(@Req() req: AuthenticatedRequest) {
    const { tenantId } = this.getActor(req);
    return this.operationsDashboardService.getMaterialsOverview(tenantId);
  }

  @Get('business-metrics')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.dashboard.view',
  })
  @ApiOperation({
    summary: 'Get business metrics for financial KPIs',
    description:
      'Returns revenue, expenses, gross profit, and other business metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Business metrics retrieved successfully',
    type: BusinessMetricsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getBusinessMetrics(@Req() req: AuthenticatedRequest) {
    const { tenantId } = this.getActor(req);
    return this.operationsDashboardService.getBusinessMetrics(tenantId);
  }
}
