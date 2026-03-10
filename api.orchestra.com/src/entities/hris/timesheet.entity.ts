import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee, PayPeriod, Tenant } from '@/entities';
import { TimesheetDay } from './timesheet-day.entity';

export enum TimesheetStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  LOCKED = 'LOCKED',
}

@Entity('timesheets', { schema: 'hris' })
export class Timesheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'pay_period_id' })
  payPeriodId: number;

  @ManyToOne(() => PayPeriod, (payPeriod) => payPeriod.timesheets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pay_period_id' })
  payPeriod: PayPeriod;

  @Column({
    type: 'enum',
    enum: TimesheetStatus,
    default: TimesheetStatus.DRAFT,
  })
  status: TimesheetStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_regular_hours',
    default: 0,
  })
  totalRegularHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_overtime_hours',
    default: 0,
  })
  totalOvertimeHours: number;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => TimesheetDay, (day) => day.timesheet)
  days: TimesheetDay[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
