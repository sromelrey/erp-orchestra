import { Module } from '@nestjs/common';
import { InventoryAdjustmentModule } from './inventory-adjustment/inventory-adjustment.module';
import { InventoryTransferModule } from './inventory-transfer/inventory-transfer.module';

@Module({
  imports: [InventoryAdjustmentModule, InventoryTransferModule],
})
export class InventoryModule {}
