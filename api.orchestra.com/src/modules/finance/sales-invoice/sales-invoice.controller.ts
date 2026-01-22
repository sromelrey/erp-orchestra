import { Controller } from '@nestjs/common';
import { SalesInvoiceService } from './sales-invoice.service';

@Controller('sales-invoice')
export class SalesInvoiceController {
  constructor(private readonly salesInvoiceService: SalesInvoiceService) {}
}
