import { Controller } from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';

@Controller('sales-order')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}
}
