import { Module } from '@nestjs/common';
import { FinanceAnalyticsService } from './finance-analytics.service';
import { FinanceAnalyticsController } from './finance-analytics.controller';

@Module({
  controllers: [FinanceAnalyticsController],
  providers: [FinanceAnalyticsService],
})
export class FinanceAnalyticsModule {}
