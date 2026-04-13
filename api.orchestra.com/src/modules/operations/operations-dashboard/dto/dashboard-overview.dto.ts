import { ApiProperty } from '@nestjs/swagger';

export class SalesOverviewDto {
  @ApiProperty({ description: 'Total number of sales orders' })
  totalOrders: number;

  @ApiProperty({ description: 'Number of pending orders' })
  pendingOrders: number;

  @ApiProperty({ description: 'Number of confirmed orders' })
  confirmedOrders: number;

  @ApiProperty({ description: 'Number of shipped orders' })
  shippedOrders: number;

  @ApiProperty({ description: 'Number of delivered orders' })
  deliveredOrders: number;

  @ApiProperty({ description: 'Total revenue from all orders' })
  totalRevenue: number;

  @ApiProperty({ description: 'Revenue for current month' })
  thisMonthRevenue: number;
}

export class InventoryOverviewDto {
  @ApiProperty({ description: 'Total value of all stock' })
  totalStockValue: number;

  @ApiProperty({ description: 'Number of items with low stock' })
  lowStockItems: number;

  @ApiProperty({ description: 'Total number of unique items' })
  totalItems: number;

  @ApiProperty({ description: 'Total number of warehouses' })
  totalWarehouses: number;

  @ApiProperty({ description: 'Number of recent stock movements' })
  recentMovements: number;
}

export class ProductionOverviewDto {
  @ApiProperty({ description: 'Number of active production batches' })
  activeBatches: number;

  @ApiProperty({ description: 'Number of completed batches' })
  completedBatches: number;

  @ApiProperty({ description: 'Total number of batches' })
  totalBatches: number;

  @ApiProperty({ description: 'Production completion rate percentage' })
  completionRate: number;

  @ApiProperty({ description: 'Value of work in progress' })
  wipValue: number;
}

export class MaterialsOverviewDto {
  @ApiProperty({ description: 'Total number of materials' })
  totalMaterials: number;

  @ApiProperty({ description: 'Number of raw materials' })
  rawMaterials: number;

  @ApiProperty({ description: 'Number of finished goods' })
  finishedGoods: number;

  @ApiProperty({ description: 'Number of semi-finished goods' })
  semiFinished: number;

  @ApiProperty({ description: 'Number of services' })
  services: number;
}

export class RecentActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  id: number;

  @ApiProperty({ description: 'Activity date' })
  date: string;

  @ApiProperty({ description: 'Activity reference or description' })
  reference: string;

  @ApiProperty({ description: 'Activity type' })
  type: string;
}

export class RecentActivitiesDto {
  @ApiProperty({
    description: 'Recent goods receipts',
    type: [RecentActivityDto],
  })
  goodsReceipts: RecentActivityDto[];

  @ApiProperty({
    description: 'Recent production batches',
    type: [RecentActivityDto],
  })
  productionBatches: RecentActivityDto[];

  @ApiProperty({
    description: 'Recent sales orders',
    type: [RecentActivityDto],
  })
  salesOrders: RecentActivityDto[];
}

export class DashboardOverviewDto {
  @ApiProperty({
    description: 'Sales overview statistics',
    type: SalesOverviewDto,
  })
  sales: SalesOverviewDto;

  @ApiProperty({
    description: 'Inventory overview statistics',
    type: InventoryOverviewDto,
  })
  inventory: InventoryOverviewDto;

  @ApiProperty({
    description: 'Production overview statistics',
    type: ProductionOverviewDto,
  })
  production: ProductionOverviewDto;

  @ApiProperty({
    description: 'Materials overview statistics',
    type: MaterialsOverviewDto,
  })
  materials: MaterialsOverviewDto;

  @ApiProperty({
    description: 'Recent activities across modules',
    type: RecentActivitiesDto,
  })
  recentActivities: RecentActivitiesDto;
}
