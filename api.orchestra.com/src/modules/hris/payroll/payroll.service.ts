import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  Employee,
  EmployeeCompensation,
  EmployeeDeduction,
  PayPeriod,
  Payslip,
  PayslipItem,
  PayslipItemType,
  PayslipStatus,
  Timesheet,
} from '@/entities';
import { TriggerPayrollRunDto } from './dto/trigger-payroll-run.dto';

export interface RunResult {
  generated: number;
  skipped: number;
}

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payslip)
    private readonly payslipRepo: Repository<Payslip>,
    @InjectRepository(PayslipItem)
    private readonly payslipItemRepo: Repository<PayslipItem>,
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepo: Repository<PayPeriod>,
    @InjectRepository(Timesheet)
    private readonly timesheetRepo: Repository<Timesheet>,
    @InjectRepository(EmployeeCompensation)
    private readonly compensationRepo: Repository<EmployeeCompensation>,
    @InjectRepository(EmployeeDeduction)
    private readonly deductionRepo: Repository<EmployeeDeduction>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async runPayroll(
    payload: TriggerPayrollRunDto,
    tenantId: number,
  ): Promise<RunResult> {
    const payPeriod = await this.payPeriodRepo.findOne({
      where: { id: payload.payPeriodId, tenantId },
    });
    if (!payPeriod) {
      throw new NotFoundException('Pay period not found');
    }

    const timesheets = await this.timesheetRepo.find({
      where: { payPeriodId: payPeriod.id, tenantId },
    });

    let generated = 0;
    let skipped = 0;

    for (const ts of timesheets) {
      const existing = await this.payslipRepo.findOne({
        where: {
          payPeriodId: payPeriod.id,
          employeeId: ts.employeeId,
          tenantId,
        },
      });
      if (existing && !payload.force) {
        skipped++;
        continue;
      }

      const { gross, deductionsTotal, net, items } =
        await this.buildPayslipAmounts(ts, payPeriod);

      const payslip = this.payslipRepo.create({
        id: existing?.id,
        payPeriodId: payPeriod.id,
        employeeId: ts.employeeId,
        tenantId,
        status: PayslipStatus.CALCULATED,
        grossPay: gross,
        totalDeductions: deductionsTotal,
        netPay: net,
        items,
        meta: {
          timesheetId: ts.id,
          totalRegularHours: ts.totalRegularHours,
          totalOvertimeHours: ts.totalOvertimeHours,
        },
      });
      await this.payslipRepo.save(payslip);
      generated++;
    }

    return { generated, skipped };
  }

  async list(
    payPeriodId: number | undefined,
    tenantId: number,
  ): Promise<Payslip[]> {
    return this.payslipRepo.find({
      where: payPeriodId ? { payPeriodId, tenantId } : { tenantId },
      relations: ['items'],
      order: { id: 'DESC' },
    });
  }

  async get(id: number, tenantId: number): Promise<Payslip> {
    const payslip = await this.payslipRepo.findOne({
      where: { id, tenantId },
      relations: ['items', 'employee', 'payPeriod'],
    });
    if (!payslip) {
      throw new NotFoundException('Payslip not found');
    }
    return payslip;
  }

  async publish(id: number, tenantId: number): Promise<Payslip> {
    const payslip = await this.get(id, tenantId);
    if (payslip.status === PayslipStatus.PUBLISHED) {
      throw new ConflictException('Payslip already published');
    }
    payslip.status = PayslipStatus.PUBLISHED;
    return this.payslipRepo.save(payslip);
  }

  private async buildPayslipAmounts(
    ts: Timesheet,
    payPeriod: PayPeriod,
  ): Promise<{
    gross: number;
    deductionsTotal: number;
    net: number;
    items: PayslipItem[];
  }> {
    const compensation = await this.getActiveCompensation(
      ts.employeeId,
      payPeriod,
    );
    const deductions = await this.getActiveDeductions(ts.employeeId, payPeriod);

    const hourlyRate = compensation?.hourlyRate
      ? Number(compensation.hourlyRate)
      : compensation?.baseSalary
        ? Number(compensation.baseSalary) / (this.getPeriodDays(payPeriod) * 8)
        : 0;
    const overtimeRateMultiplier = compensation?.overtimeRate || 1.5;

    const regularPay = ts.totalRegularHours * hourlyRate;
    const overtimePay =
      ts.totalOvertimeHours * hourlyRate * overtimeRateMultiplier;
    const gross = this.roundCurrency(regularPay + overtimePay);

    const deductionItems = deductions.map((d) => {
      const amount = this.calculateDeductionAmount(d, gross);
      return this.payslipItemRepo.create({
        type: PayslipItemType.DEDUCTION,
        code: d.name,
        label: d.name,
        amount: this.roundCurrency(amount),
        meta: { deductionId: d.id, type: d.type },
      });
    });

    const earningsItems: PayslipItem[] = [
      this.payslipItemRepo.create({
        type: PayslipItemType.EARNING,
        code: 'REGULAR',
        label: 'Regular Pay',
        amount: this.roundCurrency(regularPay),
        meta: { hours: ts.totalRegularHours },
      }),
      this.payslipItemRepo.create({
        type: PayslipItemType.EARNING,
        code: 'OVERTIME',
        label: 'Overtime Pay',
        amount: this.roundCurrency(overtimePay),
        meta: {
          hours: ts.totalOvertimeHours,
          rateMultiplier: overtimeRateMultiplier,
        },
      }),
    ];

    const deductionsTotal = this.roundCurrency(
      deductionItems.reduce((sum, item) => sum + Number(item.amount), 0),
    );
    const net = this.roundCurrency(gross - deductionsTotal);

    return {
      gross,
      deductionsTotal,
      net,
      items: [...earningsItems, ...deductionItems],
    };
  }

  private async getActiveCompensation(
    employeeId: number,
    payPeriod: PayPeriod,
  ): Promise<EmployeeCompensation | null> {
    const start = new Date(payPeriod.startDate);
    const end = new Date(new Date(payPeriod.endDate).setHours(23, 59, 59));
    return this.compensationRepo.findOne({
      where: {
        employeeId,
        effectiveDate: Between(start, end),
        isActive: true,
      },
      order: { effectiveDate: 'DESC' },
    });
  }

  private async getActiveDeductions(
    employeeId: number,
    payPeriod: PayPeriod,
  ): Promise<EmployeeDeduction[]> {
    const start = new Date(payPeriod.startDate);
    const end = new Date(new Date(payPeriod.endDate).setHours(23, 59, 59));
    return this.deductionRepo.find({
      where: {
        employeeId,
        effectiveDate: Between(start, end),
        isActive: true,
      },
    });
  }

  private calculateDeductionAmount(
    d: EmployeeDeduction,
    gross: number,
  ): number {
    if (d.type === 'percentage' && d.percentage) {
      return (gross * Number(d.percentage)) / 100;
    }
    if (d.amount) return Number(d.amount);
    return 0;
  }

  private getPeriodDays(period: PayPeriod): number {
    const start = new Date(period.startDate).getTime();
    const end = new Date(period.endDate).getTime();
    const diffDays = Math.max(
      1,
      Math.round((end - start) / (1000 * 60 * 60 * 24) + 1),
    );
    return diffDays;
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
