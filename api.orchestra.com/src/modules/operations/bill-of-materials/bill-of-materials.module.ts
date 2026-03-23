import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillOfMaterialsService } from './bill-of-materials.service';
import { BillOfMaterialsController } from './bill-of-materials.controller';
import { BomValidationService } from './bom-validation.service';
import { BomCostingService } from './services/bom-costing.service';
import { BomRepository } from './repositories/bom.repository';
import { BomItemRepository } from './repositories/bom-item.repository';
import {
  Bom,
  BomItem,
  Material,
  BomCosting,
  BomCostingComponent,
  BomCostingHistory,
} from '@/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bom,
      BomItem,
      Material,
      BomCosting,
      BomCostingComponent,
      BomCostingHistory,
    ]),
  ],
  controllers: [BillOfMaterialsController],
  providers: [
    BillOfMaterialsService,
    BomValidationService,
    BomCostingService,
    BomRepository,
    BomItemRepository,
  ],
  exports: [BillOfMaterialsService, BomValidationService, BomCostingService],
})
export class BillOfMaterialsModule {}
