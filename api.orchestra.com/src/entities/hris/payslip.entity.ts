import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Tenant, Employee, PayPeriod } from '@/entities';
import { PayslipItem } from './payslip-item.entity';

export enum PayslipStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  PUBLISHED = 'PUBLISHED',
}

@Entity('payslips', { schema: 'hris' })
@Index(['tenantId', 'payPeriodId'])
@Index(['tenantId', 'employeeId'])
@Index(['tenantId', 'status'])
export class Payslip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pay_period_id' })
  payPeriodId: number;

  @ManyToOne(() => PayPeriod)
  @JoinColumn({ name: 'pay_period_id' })
  payPeriod: PayPeriod;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'enum', enum: PayslipStatus, default: PayslipStatus.DRAFT })
  status: PayslipStatus;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'gross_pay',
    default: 0,
  })
  grossPay: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'total_deductions',
    default: 0,
  })
  totalDeductions: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'net_pay',
    default: 0,
  })
  netPay: number;

  @Column({ type: 'jsonb', name: 'meta', nullable: true })
  meta?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 255, name: 'pdf_url', nullable: true })
  pdfUrl?: string;

  @OneToMany(() => PayslipItem, (item: PayslipItem) => item.payslip, {
    cascade: true,
  })
  items: PayslipItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
