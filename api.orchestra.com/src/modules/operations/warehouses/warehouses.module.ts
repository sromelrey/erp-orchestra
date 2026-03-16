import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Warehouse,
  WarehouseLocation,
  StockLedger,
  StockBalance,
  Item,
  UnitOfMeasure,
} from '@/entities';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      WarehouseLocation,
      StockLedger,
      StockBalance,
      Item,
      UnitOfMeasure,
    ]),
  ],
  providers: [WarehousesService],
  controllers: [WarehousesController],
})
export class WarehousesModule {}
