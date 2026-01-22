import { Module } from '@nestjs/common';
import { SalesInvoiceModule } from './sales-invoice/sales-invoice.module';
import { AccountsPayableModule } from './accounts-payable/accounts-payable.module';
import { FinanceReportingModule } from './finance-reporting/finance-reporting.module';
import { FinanceAnalyticsModule } from './finance-analytics/finance-analytics.module';

@Module({
  imports: [SalesInvoiceModule, AccountsPayableModule, FinanceReportingModule, FinanceAnalyticsModule]
})
export class FinanceModule {}
