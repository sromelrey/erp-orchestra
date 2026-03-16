import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategory } from '@/entities/operations/item-category.entity';
import { UnitOfMeasure } from '@/entities/operations/unit-of-measure.entity';
import { Item } from '@/entities/operations/item.entity';
import { ItemUnit } from '@/entities/operations/item-unit.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemCategory, UnitOfMeasure, Item, ItemUnit]),
  ],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
