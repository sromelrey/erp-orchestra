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
import { Tenant } from '@/entities';
import { Timesheet } from './timesheet.entity';

export enum PayPeriodStatus {
  OPEN = 'OPEN',
  PROCESSING = 'PROCESSING',
  CLOSED = 'CLOSED',
  PROCESSED = 'PROCESSED',
}

@Entity('pay_periods', { schema: 'hris' })
export class PayPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PayPeriodStatus,
    default: PayPeriodStatus.OPEN,
  })
  status: PayPeriodStatus;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Timesheet, (timesheet) => timesheet.payPeriod)
  timesheets: Timesheet[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'processed_at', nullable: true })
  processedAt: Date;

  @Column({ type: 'int', name: 'processing_attempts', default: 0 })
  processingAttempts: number;

  @Column({ type: 'text', name: 'last_processing_error', nullable: true })
  lastProcessingError: string;

  @Column({ type: 'timestamp', name: 'processing_started_at', nullable: true })
  processingStartedAt: Date;
}
