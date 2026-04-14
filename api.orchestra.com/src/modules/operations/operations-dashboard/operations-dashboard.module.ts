import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsDashboardService } from './operations-dashboard.service';
import { OperationsDashboardController } from './operations-dashboard.controller';
import { SalesOrder } from '@/entities/operations/sales-order.entity';
import { StockLedger } from '@/entities/operations/stock-ledger.entity';
import { ProductionBatch } from '@/entities/operations/production-batch.entity';
import { Material } from '@/entities/inventory/material.entity';
import { GoodsReceipt } from '@/entities/operations/goods-receipt.entity';
import { GoodsReceiptItem } from '@/entities/operations/goods-receipt-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesOrder,
      StockLedger,
      ProductionBatch,
      Material,
      GoodsReceipt,
      GoodsReceiptItem,
    ]),
  ],
  controllers: [OperationsDashboardController],
  providers: [OperationsDashboardService],
})
export class OperationsDashboardModule {}
