import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderController } from './sales-order.controller';
import {
  SalesOrder,
  SalesOrderItem,
  Item,
  UnitOfMeasure,
  Warehouse,
  WarehouseLocation,
} from '@/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesOrder,
      SalesOrderItem,
      Item,
      UnitOfMeasure,
      Warehouse,
      WarehouseLocation,
    ]),
  ],
  controllers: [SalesOrderController],
  providers: [SalesOrderService],
  exports: [SalesOrderService],
})
export class SalesOrderModule {}
