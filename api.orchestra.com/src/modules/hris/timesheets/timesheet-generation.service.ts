import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Not, In, LessThan } from 'typeorm';
import {
  PayPeriod,
  PayPeriodStatus,
  JobExecutionLog,
  JobExecutionStatus,
} from '@/entities';
import { TimesheetsService } from './timesheets.service';

@Injectable()
export class TimesheetGenerationService {
  private readonly logger = new Logger(TimesheetGenerationService.name);

  constructor(
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepository: Repository<PayPeriod>,
    @InjectRepository(JobExecutionLog)
    private readonly jobLogRepository: Repository<JobExecutionLog>,
    private readonly timesheetsService: TimesheetsService,
  ) {}

  /**
   * Main cron job entry point - processes all ended pay periods
   */
  async processEndedPayPeriods(): Promise<void> {
    this.logger.log('Starting automated timesheet generation process');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const eligiblePeriods = await this.payPeriodRepository.find({
      where: {
        endDate: LessThanOrEqual(yesterday),
        status: Not(
          In([PayPeriodStatus.PROCESSED, PayPeriodStatus.PROCESSING]),
        ),
        processingAttempts: LessThan(3),
      },
    });

    this.logger.log(
      `Found ${eligiblePeriods.length} eligible pay periods to process`,
    );

    for (const period of eligiblePeriods) {
      await this.processPayPeriod(period);
    }

    this.logger.log('Automated timesheet generation process completed');
  }

  /**
   * Process individual pay period with retry logic
   */
  private async processPayPeriod(period: PayPeriod): Promise<void> {
    const jobLog = this.createJobLog(period);

    try {
      this.logger.log(
        `Processing pay period: ${period.name} (ID: ${period.id})`,
      );

      await this.payPeriodRepository.update(period.id, {
        status: PayPeriodStatus.PROCESSING,
        processingStartedAt: new Date(),
      });

      // Use existing timesheets service
      const result = await this.timesheetsService.generate(
        { payPeriodId: period.id },
        period.tenantId,
      );

      await this.payPeriodRepository.update(period.id, {
        status: PayPeriodStatus.PROCESSED,
        processedAt: new Date(),
        processingAttempts: period.processingAttempts + 1,
        lastProcessingError: undefined,
      });

      this.logger.log(
        `Successfully processed ${result.generated} timesheets for period ${period.name}`,
      );

      await this.completeJobLog(
        jobLog,
        JobExecutionStatus.SUCCESS,
        result.generated,
        0,
      );
    } catch (error: unknown) {
      await this.handleProcessingError(period, jobLog, error as Error);
    }
  }

  /**
   * Handle processing errors with retry logic
   */
  private async handleProcessingError(
    period: PayPeriod,
    jobLog: JobExecutionLog,
    error: Error,
  ): Promise<void> {
    const errorMessage = error?.message || 'Unknown error occurred';
    const newAttemptCount = period.processingAttempts + 1;

    this.logger.error(
      `Error processing pay period ${period.name}: ${errorMessage}`,
    );

    await this.payPeriodRepository.update(period.id, {
      status:
        newAttemptCount >= 3 ? PayPeriodStatus.CLOSED : PayPeriodStatus.OPEN,
      processingAttempts: newAttemptCount,
      lastProcessingError: errorMessage,
    });

    const jobStatus =
      newAttemptCount >= 3
        ? JobExecutionStatus.FAILED
        : JobExecutionStatus.PARTIAL;
    await this.completeJobLog(jobLog, jobStatus, 0, 1);

    if (newAttemptCount >= 3) {
      this.logger.error(
        `Pay period ${period.name} failed after 3 attempts - manual intervention required`,
      );
    }
  }

  /**
   * Create initial job execution log
   */
  private createJobLog(period: PayPeriod): JobExecutionLog {
    const jobLog = this.jobLogRepository.create({
      jobName: 'timesheet-generation',
      metadata: {
        payPeriodId: period.id,
        payPeriodName: period.name,
        tenantId: period.tenantId,
      },
      status: JobExecutionStatus.PARTIAL,
      processedCount: 0,
      errorCount: 0,
      startedAt: new Date(),
      completedAt: new Date(),
      tenantId: period.tenantId,
    });

    return jobLog;
  }

  /**
   * Complete job execution log with final status
   */
  private async completeJobLog(
    jobLog: JobExecutionLog,
    status: JobExecutionStatus,
    processedCount: number,
    errorCount: number,
  ): Promise<void> {
    jobLog.status = status;
    jobLog.processedCount = processedCount;
    jobLog.errorCount = errorCount;
    jobLog.completedAt = new Date();

    if (status === JobExecutionStatus.FAILED) {
      jobLog.errorMessage = 'Processing failed after maximum retry attempts';
    }

    await this.jobLogRepository.save(jobLog);
  }

  /**
   * Get recent job execution status for monitoring
   */
  async getRecentJobStatus(tenantId: number): Promise<JobExecutionLog[]> {
    return this.jobLogRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
