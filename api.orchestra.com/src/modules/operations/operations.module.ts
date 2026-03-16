import { Module } from '@nestjs/common';
import { ProcurementModule } from './procurement/procurement.module';
import { MaterialMasterModule } from './material-master/material-master.module';
import { BillOfMaterialsModule } from './bill-of-materials/bill-of-materials.module';
import { GoodsReceiptModule } from './goods-receipt/goods-receipt.module';
import { SalesOrderModule } from './sales-order/sales-order.module';
import { GoodsIssueModule } from './goods-issue/goods-issue.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    MaterialMasterModule,
    BillOfMaterialsModule,
    ItemsModule,
    WarehousesModule,
    ProcurementModule,
    GoodsReceiptModule,
    SalesOrderModule,
    GoodsIssueModule,
  ],
  controllers: [],
})
export class OperationsModule {}
