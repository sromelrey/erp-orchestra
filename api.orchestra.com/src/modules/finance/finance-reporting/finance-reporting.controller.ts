import { Controller } from '@nestjs/common';
import { FinanceReportingService } from './finance-reporting.service';

@Controller('finance-reporting')
export class FinanceReportingController {
  constructor(
    private readonly financeReportingService: FinanceReportingService,
  ) {}
}
