import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  Timesheet,
  TimesheetStatus,
  TimesheetDay,
  TimeEvent,
  TimeEventType,
} from '@/entities';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { GenerateTimesheetsDto } from './dto/generate-timesheets.dto';
import { UpdateTimesheetStatusDto } from './dto/update-timesheet-status.dto';

@Injectable()
export class TimesheetsService {
  constructor(
    @InjectRepository(Timesheet)
    private readonly timesheetRepository: Repository<Timesheet>,
    @InjectRepository(TimesheetDay)
    private readonly timesheetDayRepository: Repository<TimesheetDay>,
    @InjectRepository(TimeEvent)
    private readonly timeEventRepository: Repository<TimeEvent>,
    private readonly payPeriodsService: PayPeriodsService,
  ) {}

  /**
   * Generates or refreshes timesheets for a specified pay period.
   * Scans all attendance logs and aggregates them into structured days.
   */
  async generate(
    generateDto: GenerateTimesheetsDto,
    tenantId: number,
  ): Promise<{ generated: number }> {
    const period = await this.payPeriodsService.findOne(
      generateDto.payPeriodId,
      tenantId,
    );

    // Get all time events within the period for this tenant
    const events = await this.timeEventRepository.find({
      where: {
        timestamp: Between(
          new Date(period.startDate),
          new Date(new Date(period.endDate).setHours(23, 59, 59)),
        ),
        tenantId,
      },
      order: { employeeId: 'ASC', timestamp: 'ASC' },
      relations: ['employee'],
    });

    if (events.length === 0) {
      return { generated: 0 };
    }

    // Group events by Employee -> Date
    const grouped = events.reduce(
      (acc, event) => {
        const empId = event.employeeId;
        const dateStr = new Date(event.timestamp).toISOString().split('T')[0];

        if (!acc[empId]) acc[empId] = {};
        if (!acc[empId][dateStr]) acc[empId][dateStr] = [];
        acc[empId][dateStr].push(event);
        return acc;
      },
      {} as Record<string, Record<string, TimeEvent[]>>,
    );

    let count = 0;
    for (const [empIdStr, days] of Object.entries(grouped)) {
      const employeeId = parseInt(empIdStr);

      // Check for existing timesheet
      let timesheet = await this.timesheetRepository.findOne({
        where: { employeeId, payPeriodId: period.id, tenantId },
      });

      if (
        timesheet &&
        (timesheet.status === TimesheetStatus.LOCKED ||
          timesheet.status === TimesheetStatus.APPROVED)
      ) {
        continue; // Only process Draft or Missing timesheets
      }

      if (!timesheet) {
        timesheet = this.timesheetRepository.create({
          employeeId,
          payPeriodId: period.id,
          tenantId,
          status: TimesheetStatus.DRAFT,
        });
        await this.timesheetRepository.save(timesheet);
      } else {
        // Clear existing days for refresh
        await this.timesheetDayRepository.delete({ timesheetId: timesheet.id });
      }

      let totalRegularHours = 0;
      let totalOvertimeHours = 0;

      // Process each day
      for (const [date, dayEvents] of Object.entries(days)) {
        const sortedEvents = dayEvents.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

        const firstIn = sortedEvents.find(
          (e) => e.type === TimeEventType.CLOCK_IN,
        );
        const lastOut = [...sortedEvents]
          .reverse()
          .find((e) => e.type === TimeEventType.CLOCK_OUT);

        let hours = 0;
        let isAnomaly = false;
        let anomalyReason: string | null = null;

        if (
          firstIn &&
          lastOut &&
          new Date(lastOut.timestamp) > new Date(firstIn.timestamp)
        ) {
          const diffMs =
            new Date(lastOut.timestamp).getTime() -
            new Date(firstIn.timestamp).getTime();
          hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimals
        } else {
          isAnomaly = true;
          anomalyReason = !firstIn
            ? 'Missing Clock-in'
            : !lastOut
              ? 'Missing Clock-out'
              : 'Clock-out is before Clock-in';
        }

        // Basic OT logic: Anything over 8 hours
        const dailyRegular = Math.min(8, hours);
        const dailyOT = Math.max(0, hours - 8);

        totalRegularHours += dailyRegular;
        totalOvertimeHours += dailyOT;

        const dayRecord = this.timesheetDayRepository.create({
          timesheetId: timesheet.id,
          date: new Date(date),
          checkIn: firstIn?.timestamp ? new Date(firstIn.timestamp) : null,
          checkOut: lastOut?.timestamp
            ? lastOut.timestamp instanceof Date
              ? lastOut.timestamp
              : new Date(lastOut.timestamp)
            : null,
          regularHours: dailyRegular,
          overtimeHours: dailyOT,
          isAnomaly,
          anomalyReason,
        });
        await this.timesheetDayRepository.save(dayRecord);
      }

      // Update timesheet totals
      timesheet.totalRegularHours = totalRegularHours;
      timesheet.totalOvertimeHours = totalOvertimeHours;
      await this.timesheetRepository.save(timesheet);
      count++;
    }

    return { generated: count };
  }

  /**
   * Retrieves all timesheets for a period.
   */
  async findAll(payPeriodId: number, tenantId: number): Promise<Timesheet[]> {
    return this.timesheetRepository.find({
      where: { payPeriodId, tenantId },
      relations: ['employee'],
      order: { employee: { lastName: 'ASC' } },
    });
  }

  /**
   * Gets a specific timesheet with daily details.
   */
  async findOne(id: string, tenantId: number): Promise<Timesheet> {
    const timesheet = await this.timesheetRepository.findOne({
      where: { id, tenantId },
      relations: ['employee', 'days', 'payPeriod'],
    });

    if (!timesheet) {
      throw new NotFoundException(`Timesheet #${id} not found`);
    }

    // Sort days chronologically
    timesheet.days = (timesheet.days || []).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return timesheet;
  }

  /**
   * Updates timesheet status (Approval Flow).
   */
  async updateStatus(
    id: string,
    updateDto: UpdateTimesheetStatusDto,
    tenantId: number,
  ): Promise<Timesheet> {
    const timesheet = await this.findOne(id, tenantId);

    // Safety check: Don't allow unlocking Locked timesheets via generic update
    if (timesheet.status === TimesheetStatus.LOCKED) {
      throw new ConflictException('LOCKED timesheets cannot be modified.');
    }

    timesheet.status = updateDto.status;
    return this.timesheetRepository.save(timesheet);
  }

  /**
   * Retrieves summary for high-level dashboard.
   */
  async getSummary(payPeriodId: number, tenantId: number) {
    const timesheets = await this.timesheetRepository.find({
      where: { payPeriodId, tenantId },
      relations: ['days'],
    });

    const stats = {
      total: timesheets.length,
      approved: timesheets.filter((t) => t.status === TimesheetStatus.APPROVED)
        .length,
      pending: timesheets.filter(
        (t) =>
          t.status === TimesheetStatus.PENDING_REVIEW ||
          t.status === TimesheetStatus.DRAFT,
      ).length,
      anomalies: timesheets.reduce(
        (acc, t) => acc + (t.days.some((d) => d.isAnomaly) ? 1 : 0),
        0,
      ),
    };

    return stats;
  }
}
