import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TimesheetsService } from './timesheets.service';
import { TimesheetsController } from './timesheets.controller';
import { TimesheetGenerationService } from './timesheet-generation.service';
import { TimesheetCronService } from './timesheet-cron.service';
import {
  Timesheet,
  TimesheetDay,
  TimeEvent,
  PayPeriod,
  JobExecutionLog,
} from '@/entities';
import { PayPeriodsModule } from '../pay-periods/pay-periods.module';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Timesheet,
      TimesheetDay,
      TimeEvent,
      PayPeriod,
      JobExecutionLog,
    ]),
    PayPeriodsModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [TimesheetsController],
  providers: [
    TimesheetsService,
    TimesheetGenerationService,
    TimesheetCronService,
  ],
  exports: [TimesheetsService, TimesheetGenerationService],
})
export class TimesheetsModule {}
