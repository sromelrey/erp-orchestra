import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceiptService } from './goods-receipt.service';
import { GoodsReceiptController } from './goods-receipt.controller';
import { GoodsReceipt } from '@/entities/operations/goods-receipt.entity';
import { GoodsReceiptItem } from '@/entities/operations/goods-receipt-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt, GoodsReceiptItem])],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}
