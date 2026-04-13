import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DashboardOverviewDto,
  SalesOverviewDto,
  InventoryOverviewDto,
  ProductionOverviewDto,
  MaterialsOverviewDto,
  RecentActivitiesDto,
} from './dto/dashboard-overview.dto';
import {
  BusinessMetricsDto,
  MonthlyDataPointDto,
} from './dto/business-metrics.dto';
import { GoodsReceiptItem } from '@/entities/operations/goods-receipt-item.entity';
import {
  SalesOrder,
  SalesOrderStatus,
} from '@/entities/operations/sales-order.entity';
import { StockLedger } from '@/entities/operations/stock-ledger.entity';
import {
  ProductionBatch,
  ProductionStatus,
} from '@/entities/operations/production-batch.entity';
import { Material } from '@/entities/inventory/material.entity';
import { GoodsReceipt } from '@/entities/operations/goods-receipt.entity';
import { MaterialType } from '@/types/enums';

@Injectable()
export class OperationsDashboardService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(StockLedger)
    private readonly stockLedgerRepository: Repository<StockLedger>,
    @InjectRepository(ProductionBatch)
    private readonly productionBatchRepository: Repository<ProductionBatch>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(GoodsReceipt)
    private readonly goodsReceiptRepository: Repository<GoodsReceipt>,
    @InjectRepository(GoodsReceiptItem)
    private readonly goodsReceiptItemRepository: Repository<GoodsReceiptItem>,
  ) {}

  /**
   * Get complete dashboard overview with all statistics
   */
  async getDashboardOverview(tenantId: number): Promise<DashboardOverviewDto> {
    const [sales, inventory, production, materials, recentActivities] =
      await Promise.all([
        this.getSalesOverview(tenantId),
        this.getInventoryOverview(),
        this.getProductionOverview(tenantId),
        this.getMaterialsOverview(tenantId),
        this.getRecentActivities(tenantId),
      ]);

    return {
      sales,
      inventory,
      production,
      materials,
      recentActivities,
    };
  }

  /**
   * Get sales overview statistics
   */
  async getSalesOverview(tenantId: number): Promise<SalesOverviewDto> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenueResult,
      thisMonthRevenueResult,
    ] = await Promise.all([
      this.salesOrderRepository.count({ where: { tenantId } }),
      this.salesOrderRepository.count({
        where: { tenantId, status: SalesOrderStatus.DRAFT },
      }),
      this.salesOrderRepository.count({
        where: { tenantId, status: SalesOrderStatus.CONFIRMED },
      }),
      this.salesOrderRepository.count({
        where: { tenantId, status: SalesOrderStatus.SHIPPED },
      }),
      this.salesOrderRepository.count({
        where: { tenantId, status: SalesOrderStatus.DELIVERED },
      }),
      this.salesOrderRepository
        .createQueryBuilder('so')
        .select('SUM(so.totalAmount)', 'total')
        .where('so.tenantId = :tenantId', { tenantId })
        .getRawOne() as Promise<{ total: string }>,
      this.salesOrderRepository
        .createQueryBuilder('so')
        .select('SUM(so.totalAmount)', 'total')
        .where('so.tenantId = :tenantId', { tenantId })
        .andWhere('so.orderDate >= :currentMonth', { currentMonth })
        .getRawOne() as Promise<{ total: string }>,
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue: Number(totalRevenueResult?.total || 0),
      thisMonthRevenue: Number(thisMonthRevenueResult?.total || 0),
    };
  }

  /**
   * Get inventory overview statistics
   */
  getInventoryOverview(): Promise<InventoryOverviewDto> {
    // For now, return placeholder values
    // TODO: Implement actual inventory calculations
    return Promise.resolve({
      totalStockValue: 0,
      lowStockItems: 0,
      totalItems: 0,
      totalWarehouses: 0,
      recentMovements: 0,
    });
  }

  /**
   * Get production overview statistics
   */
  async getProductionOverview(
    tenantId: number,
  ): Promise<ProductionOverviewDto> {
    const [totalBatches, activeBatches, completedBatches] = await Promise.all([
      this.productionBatchRepository.count({ where: { tenantId } }),
      this.productionBatchRepository.count({
        where: { tenantId, status: ProductionStatus.IN_PROGRESS },
      }),
      this.productionBatchRepository.count({
        where: { tenantId, status: ProductionStatus.COMPLETED },
      }),
    ]);

    const completionRate =
      totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0;

    return {
      totalBatches,
      activeBatches,
      completedBatches,
      completionRate: Math.round(completionRate * 100) / 100,
      wipValue: 0, // TODO: Calculate WIP value
    };
  }

  /**
   * Get materials overview statistics
   */
  async getMaterialsOverview(tenantId: number): Promise<MaterialsOverviewDto> {
    const [
      totalMaterials,
      rawMaterials,
      finishedGoods,
      semiFinished,
      services,
    ] = await Promise.all([
      this.materialRepository.count({ where: { tenantId } }),
      this.materialRepository.count({
        where: { tenantId, materialType: MaterialType.RAW },
      }),
      this.materialRepository.count({
        where: { tenantId, materialType: MaterialType.FINISHED },
      }),
      this.materialRepository.count({
        where: { tenantId, materialType: MaterialType.SEMI_FINISHED },
      }),
      this.materialRepository.count({
        where: { tenantId, materialType: MaterialType.SERVICE },
      }),
    ]);

    return {
      totalMaterials,
      rawMaterials,
      finishedGoods,
      semiFinished,
      services,
    };
  }

  /**
   * Get recent activities across modules
   */
  async getRecentActivities(tenantId: number): Promise<RecentActivitiesDto> {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [goodsReceipts, productionBatches, salesOrders] = await Promise.all([
      this.goodsReceiptRepository
        .createQueryBuilder('gr')
        .select(['gr.id', 'gr.receiptDate', 'gr.receiptNumber'])
        .where('gr.tenantId = :tenantId', { tenantId })
        .andWhere('gr.createdAt >= :lastWeek', { lastWeek })
        .orderBy('gr.createdAt', 'DESC')
        .limit(5)
        .getMany(),
      this.productionBatchRepository
        .createQueryBuilder('pb')
        .select(['pb.id', 'pb.createdAt', 'pb.status'])
        .where('pb.tenantId = :tenantId', { tenantId })
        .andWhere('pb.createdAt >= :lastWeek', { lastWeek })
        .orderBy('pb.createdAt', 'DESC')
        .limit(5)
        .getMany(),
      this.salesOrderRepository
        .createQueryBuilder('so')
        .select(['so.id', 'so.createdAt', 'so.customerName'])
        .where('so.tenantId = :tenantId', { tenantId })
        .andWhere('so.createdAt >= :lastWeek', { lastWeek })
        .orderBy('so.createdAt', 'DESC')
        .limit(5)
        .getMany(),
    ]);

    return {
      goodsReceipts: goodsReceipts.map((gr) => ({
        id: gr.id,
        date: gr.receiptDate?.toISOString() || gr.createdAt.toISOString(),
        reference: gr.receiptNumber,
        type: 'goods-receipt',
      })),
      productionBatches: productionBatches.map((pb) => ({
        id: pb.id,
        date: pb.createdAt.toISOString(),
        reference: `Batch #${pb.id}`,
        type: 'production-batch',
      })),
      salesOrders: salesOrders.map((so) => ({
        id: so.id,
        date: so.createdAt.toISOString(),
        reference: so.customerName || `Order #${so.id}`,
        type: 'sales-order',
      })),
    };
  }

  /**
   * Get business metrics for financial KPI dashboard
   */
  async getBusinessMetrics(tenantId: number): Promise<BusinessMetricsDto> {
    // Get current date and 12 months ago
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    // Monthly sales data
    const monthlySales = await this.salesOrderRepository
      .createQueryBuilder('so')
      .select([
        "DATE_TRUNC('month', so.orderDate)::text AS month",
        'SUM(so.finalAmount) AS amount',
      ])
      .where('so.tenantId = :tenantId', { tenantId })
      .andWhere('so.status != :status', { status: SalesOrderStatus.CANCELLED })
      .andWhere('so.orderDate >= :startDate', { startDate: twelveMonthsAgo })
      .groupBy("DATE_TRUNC('month', so.orderDate)")
      .orderBy('month', 'ASC')
      .getRawMany<{ month: string; amount: string }>()
      .then((results) =>
        results.map((r) => ({
          month: r.month.slice(0, 7),
          amount: parseFloat(r.amount) || 0,
        })),
      );

    // Monthly expenses data (goods receipts)
    const monthlyExpenses = await this.goodsReceiptItemRepository
      .createQueryBuilder('gri')
      .innerJoin('gri.goodsReceipt', 'gr')
      .select([
        "DATE_TRUNC('month', gr.receiptDate)::text AS month",
        'SUM(gri.totalPrice) AS amount',
      ])
      .where('gr.tenantId = :tenantId', { tenantId })
      .andWhere('gr.receiptDate >= :startDate', { startDate: twelveMonthsAgo })
      .andWhere('gr.status = :status', { status: 'CONFIRMED' })
      .groupBy("DATE_TRUNC('month', gr.receiptDate)")
      .orderBy('month', 'ASC')
      .getRawMany<{ month: string; amount: string }>()
      .then((results) =>
        results.map((r) => ({
          month: r.month.slice(0, 7),
          amount: parseFloat(r.amount) || 0,
        })),
      );

    // Calculate totals
    const totalRevenue = monthlySales.reduce((sum, m) => sum + m.amount, 0);
    const totalExpense = monthlyExpenses.reduce((sum, m) => sum + m.amount, 0);
    const grossProfit = totalRevenue - totalExpense;
    const grossMargin =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // This month values
    const thisMonthRevenue =
      monthlySales.find((m) => m.month === currentMonth)?.amount || 0;
    const thisMonthExpense =
      monthlyExpenses.find((m) => m.month === currentMonth)?.amount || 0;

    // Monthly gross profit
    const monthlyGrossProfit: MonthlyDataPointDto[] = [];
    const allMonths = new Set([
      ...monthlySales.map((m) => m.month),
      ...monthlyExpenses.map((m) => m.month),
    ]);

    Array.from(allMonths)
      .sort()
      .forEach((month) => {
        const sales = monthlySales.find((m) => m.month === month)?.amount || 0;
        const expenses =
          monthlyExpenses.find((m) => m.month === month)?.amount || 0;
        monthlyGrossProfit.push({ month, amount: sales - expenses });
      });

    // Top customers
    const topCustomers = await this.salesOrderRepository
      .createQueryBuilder('so')
      .select(['so.customerName AS name', 'SUM(so.finalAmount) AS amount'])
      .where('so.tenantId = :tenantId', { tenantId })
      .andWhere('so.status != :status', { status: SalesOrderStatus.CANCELLED })
      .groupBy('so.customerName')
      .orderBy('amount', 'DESC')
      .limit(5)
      .getRawMany<{ name: string; amount: string }>()
      .then((results) =>
        results.map((r) => ({
          name: r.name,
          amount: parseFloat(r.amount) || 0,
        })),
      );

    // Inventory status
    // For now, use placeholder values since stock_ledger doesn't have unit_cost
    // TODO: Implement proper inventory valuation using Item cost or Material cost
    const inventoryValue = 0;

    // Low stock count (items below 10 units)
    const lowStockCount = await this.stockLedgerRepository
      .createQueryBuilder('sl')
      .select('COUNT(DISTINCT sl.itemId)', 'count')
      .where('sl.tenantId = :tenantId', { tenantId })
      .andWhere('CAST(sl.quantity AS NUMERIC) < :threshold', { threshold: 10 })
      .getRawOne<{ count: string }>()
      .then((result) => parseInt(result?.count || '0'));

    // Inventory turnover (12-month expense / average inventory value)
    const twelveMonthExpense = monthlyExpenses
      .filter((m) => m.month >= twelveMonthsAgo.toISOString().slice(0, 7))
      .reduce((sum, m) => sum + m.amount, 0);
    const inventoryTurnover =
      inventoryValue > 0 ? twelveMonthExpense / inventoryValue : 0;

    return {
      totalRevenue,
      thisMonthRevenue,
      totalExpense,
      thisMonthExpense,
      grossProfit,
      grossMargin,
      monthlySales,
      monthlyExpenses,
      monthlyGrossProfit,
      topCustomers,
      inventoryStatus: {
        value: inventoryValue,
        turnover: inventoryTurnover,
        lowStockCount,
      },
    };
  }
}
