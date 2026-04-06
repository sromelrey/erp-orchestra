import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransfer, StockTransferItem } from '@/entities';
import { InventoryTransferService } from './inventory-transfer.service';
import { InventoryTransferController } from './inventory-transfer.controller';
import { StockMovementService } from '../stock-movement.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockTransfer, StockTransferItem])],
  controllers: [InventoryTransferController],
  providers: [InventoryTransferService, StockMovementService],
  exports: [InventoryTransferService],
})
export class InventoryTransferModule {}
