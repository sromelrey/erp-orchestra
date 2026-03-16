import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item, ItemCategory, ItemUnit, UnitOfMeasure } from '@/entities';
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
