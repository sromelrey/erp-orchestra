import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimesheetGenerationService } from './timesheet-generation.service';

@Injectable()
export class TimesheetCronService {
  constructor(
    private readonly timesheetGenerationService: TimesheetGenerationService,
  ) {}

  /**
   * Run daily at 2:00 AM server time
   */
  @Cron('0 2 * * *')
  async handleTimesheetGeneration(): Promise<void> {
    await this.timesheetGenerationService.processEndedPayPeriods();
  }
}
