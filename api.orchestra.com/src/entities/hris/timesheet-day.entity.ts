import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Timesheet } from './timesheet.entity';

@Entity('timesheet_days', { schema: 'hris' })
export class TimesheetDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'timesheet_id' })
  timesheetId: string;

  @ManyToOne(() => Timesheet, (timesheet) => timesheet.days, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'timesheet_id' })
  timesheet: Timesheet;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp', name: 'check_in', nullable: true })
  checkIn: Date | null;

  @Column({ type: 'timestamp', name: 'check_out', nullable: true })
  checkOut: Date | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'regular_hours',
    default: 0,
  })
  regularHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'overtime_hours',
    default: 0,
  })
  overtimeHours: number;

  @Column({ type: 'boolean', name: 'is_anomaly', default: false })
  isAnomaly: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'anomaly_reason',
    nullable: true,
  })
  anomalyReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
