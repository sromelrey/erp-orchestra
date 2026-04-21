import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderImportService } from './sales-order-import.service';
import { SalesOrderController } from './sales-order.controller';
import {
  SalesOrder,
  SalesOrderItem,
  Item,
  UnitOfMeasure,
  Warehouse,
  WarehouseLocation,
  SalesOrderItemAddon,
} from '@/entities';
import { ServiceConfigModule } from '../../service-config/service-config.module';
import { AddonsModule } from '../../addons/addons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesOrder,
      SalesOrderItem,
      Item,
      UnitOfMeasure,
      Warehouse,
      WarehouseLocation,
      SalesOrderItemAddon,
    ]),
    ServiceConfigModule,
    AddonsModule,
  ],
  controllers: [SalesOrderController],
  providers: [SalesOrderService, SalesOrderImportService],
  exports: [SalesOrderService],
})
export class SalesOrderModule {}
