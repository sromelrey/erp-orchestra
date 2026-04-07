import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import {
  ProductionBatch,
  ProductionWorkOrder,
  ProductionConsumption,
  Bom,
  BomItem,
  Item,
  StockLedger,
} from '@/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionBatch,
      ProductionWorkOrder,
      ProductionConsumption,
      Bom,
      BomItem,
      Item,
      StockLedger,
    ]),
  ],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService],
})
export class ProductionModule {}
