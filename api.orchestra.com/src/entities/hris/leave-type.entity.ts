import { Entity, Column, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';

@Entity({ name: 'leave_types', schema: 'hris' })
export class LeaveType extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int', nullable: true })
  @Index()
  tenantId?: number | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_paid', type: 'boolean', default: true })
  isPaid: boolean;

  @Column({ name: 'default_days_per_year', type: 'int', default: 0 })
  defaultDaysPerYear: number;

  @Column({ name: 'min_days_advance', type: 'int', default: 0 })
  minDaysAdvance: number;

  @Column({ name: 'allow_past_dates', type: 'boolean', default: true })
  allowPastDates: boolean;

  @Column({ name: 'allow_same_day', type: 'boolean', default: true })
  allowSameDay: boolean;
}
