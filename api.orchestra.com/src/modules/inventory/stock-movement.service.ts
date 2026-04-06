import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { StockLedger } from '@/entities';
import { StockMovementType } from '@/types/enums';

// interface StockBalanceResult {
//   balance: string;
// }

@Injectable()
export class StockMovementService {
  constructor(private readonly dataSource: DataSource) {}

  async createMovement(
    data: {
      itemId: number;
      warehouseId: number;
      locationId?: number;
      movementType: StockMovementType;
      quantity: number;
      unitCost?: number;
      referenceType?: string;
      referenceId?: number;
      batchNumber?: string;
      expiryDate?: Date;
      notes?: string;
      tenantId: number;
    },
    queryRunner?: QueryRunner,
  ) {
    const manager = queryRunner?.manager || this.dataSource.manager;

    // Get current stock balance
    // const currentBalance = await manager
    //   .createQueryBuilder()
    //   .select('COALESCE(SUM(quantity), 0)', 'balance')
    //   .from(StockLedger, 'sl')
    //   .where('sl.item_id = :itemId', { itemId: data.itemId })
    //   .andWhere('sl.warehouse_id = :warehouseId', {
    //     warehouseId: data.warehouseId,
    //   })
    //   .andWhere('sl.location_id = :locationId', { locationId: data.locationId })
    //   .andWhere('sl.tenant_id = :tenantId', { tenantId: data.tenantId })
    //   .getRawOne<StockBalanceResult>();

    // const balanceAfter = Number(currentBalance?.balance || 0) + data.quantity; // TODO: Re-enable after adding balance_after column migration

    // Create stock ledger entry
    await manager.insert(StockLedger, {
      itemId: data.itemId,
      warehouseId: data.warehouseId,
      locationId: data.locationId,
      uomId: 1, // Default UOM ID - this should be passed as parameter
      quantity: data.quantity.toString(),
      // balanceAfter: balanceAfter.toString(), // TODO: Add migration for balance_after column
      movementType: data.movementType,
      referenceType: data.referenceType,
      referenceCode: data.referenceId?.toString(), // Convert ID to string
      memo: data.notes,
      documentDate: new Date(),
      tenantId: data.tenantId,
    });

    // Update stock balance (if table exists)
    // This would be implemented based on your stock balance table structure
  }
}
