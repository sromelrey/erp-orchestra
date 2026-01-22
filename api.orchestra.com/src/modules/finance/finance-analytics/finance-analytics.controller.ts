import { Controller } from '@nestjs/common';
import { FinanceAnalyticsService } from './finance-analytics.service';

@Controller('finance-analytics')
export class FinanceAnalyticsController {
  constructor(private readonly financeAnalyticsService: FinanceAnalyticsService) {}
}
