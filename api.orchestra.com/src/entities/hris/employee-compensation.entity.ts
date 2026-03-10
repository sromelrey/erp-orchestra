import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Employee } from './employee.entity';

/**
 * Represents an employee's compensation information including salary and rates.
 */
@Entity({ name: 'employee_compensations', schema: 'hris' })
@Index(['employeeId', 'effectiveDate'], {
  unique: false, // Allow multiple entries for history
  where: 'deleted_at IS NULL',
})
export class EmployeeCompensation extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  @Index()
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    name: 'base_salary',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  baseSalary?: number;

  @Column({
    name: 'hourly_rate',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  hourlyRate?: number;

  @Column({
    name: 'overtime_rate',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    default: 1.5,
  })
  overtimeRate?: number;

  @Column({
    name: 'effective_date',
    type: 'date',
    nullable: false,
  })
  effectiveDate: Date;

  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate?: Date;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 3,
    nullable: false,
    default: 'USD',
  })
  currency: string;

  @Column({
    name: 'payment_frequency',
    type: 'enum',
    enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'],
    nullable: false,
    default: 'monthly',
  })
  paymentFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;
}
