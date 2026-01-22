import { Module } from '@nestjs/common';
import { SalesInvoiceService } from './sales-invoice.service';
import { SalesInvoiceController } from './sales-invoice.controller';

@Module({
  controllers: [SalesInvoiceController],
  providers: [SalesInvoiceService],
})
export class SalesInvoiceModule {}
