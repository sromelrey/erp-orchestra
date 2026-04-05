import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsIssuanceService } from './goods-issuance.service';
import { GoodsIssuanceController } from './goods-issuance.controller';
import { GoodsIssuance } from '@/entities/operations/goods-issuance.entity';
import { GoodsIssuanceItem } from '@/entities/operations/goods-issuance-item.entity';
import { Item } from '@/entities/operations/item.entity';
import { UnitOfMeasure } from '@/entities/operations/unit-of-measure.entity';
import { Warehouse } from '@/entities/operations/warehouse.entity';
import { WarehouseLocation } from '@/entities/operations/warehouse-location.entity';
import { StockBalance } from '@/entities/operations/stock-balance.entity';
import { PermissionModule } from '@/modules/system/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoodsIssuance,
      GoodsIssuanceItem,
      Item,
      UnitOfMeasure,
      Warehouse,
      WarehouseLocation,
      StockBalance,
    ]),
    PermissionModule,
  ],
  controllers: [GoodsIssuanceController],
  providers: [GoodsIssuanceService],
  exports: [GoodsIssuanceService],
})
export class GoodsIssuanceModule {}
