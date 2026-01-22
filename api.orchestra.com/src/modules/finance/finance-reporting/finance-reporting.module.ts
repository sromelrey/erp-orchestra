import { Module } from '@nestjs/common';
import { FinanceReportingService } from './finance-reporting.service';
import { FinanceReportingController } from './finance-reporting.controller';

@Module({
  controllers: [FinanceReportingController],
  providers: [FinanceReportingService],
})
export class FinanceReportingModule {}
