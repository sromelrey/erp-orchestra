import { Controller } from '@nestjs/common';
import { GoodsReceiptService } from './goods-receipt.service';

@Controller('goods-receipt')
export class GoodsReceiptController {
  constructor(private readonly goodsReceiptService: GoodsReceiptService) {}
}
