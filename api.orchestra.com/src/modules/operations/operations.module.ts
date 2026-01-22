import { Module } from '@nestjs/common';
 import { ProcurementModule } from './procurement/procurement.module';
 import { MaterialMasterModule } from './material-master/material-master.module';
 import { BillOfMaterialsModule } from './bill-of-materials/bill-of-materials.module';
 import { GoodsReceiptModule } from './goods-receipt/goods-receipt.module';
 import { SalesOrderModule } from './sales-order/sales-order.module';
 import { GoodsIssueModule } from './goods-issue/goods-issue.module';

@Module({
  imports: [
    MaterialMasterModule,
    BillOfMaterialsModule,
    ProcurementModule,
    GoodsReceiptModule,
    SalesOrderModule,
    GoodsIssueModule,
  ],
  controllers: [],
})
export class OperationsModule {}
