import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Employee } from './employee.entity';

export enum TimeEventType {
  CLOCK_IN = 'CLOCK_IN',
  CLOCK_OUT = 'CLOCK_OUT',
}

@Entity({ name: 'time_events', schema: 'hris' })
export class TimeEvent extends CommonEntity {
  @Column({ name: 'employee_id' })
  @Index()
  employeeId: number;

  @Column({ name: 'tenant_id', type: 'int', nullable: true })
  @Index()
  tenantId?: number | null;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'enum', enum: TimeEventType })
  type: TimeEventType;

  @Column({ type: 'timestamp with time zone' })
  @Index()
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  };

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'device_info', type: 'text', nullable: true })
  deviceInfo: string;
}
