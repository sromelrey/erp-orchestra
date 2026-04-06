import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustment, StockAdjustmentItem } from '@/entities';
import { InventoryAdjustmentService } from './inventory-adjustment.service';
import { InventoryAdjustmentController } from './inventory-adjustment.controller';
import { StockMovementService } from '../stock-movement.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockAdjustment, StockAdjustmentItem])],
  controllers: [InventoryAdjustmentController],
  providers: [InventoryAdjustmentService, StockMovementService],
  exports: [InventoryAdjustmentService],
})
export class InventoryAdjustmentModule {}
