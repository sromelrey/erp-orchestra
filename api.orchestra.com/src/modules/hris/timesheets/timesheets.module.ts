import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetsService } from './timesheets.service';
import { TimesheetsController } from './timesheets.controller';
import { Timesheet, TimesheetDay, TimeEvent } from '@/entities';
import { PayPeriodsModule } from '../pay-periods/pay-periods.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timesheet, TimesheetDay, TimeEvent]),
    PayPeriodsModule,
  ],
  controllers: [TimesheetsController],
  providers: [TimesheetsService],
  exports: [TimesheetsService],
})
export class TimesheetsModule {}
