import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Employee } from './employee.entity';

/**
 * Represents deductions from employee compensation such as taxes, insurance, loans, etc.
 */
@Entity({ name: 'employee_deductions', schema: 'hris' })
@Index(['employeeId', 'effectiveDate'], {
  unique: false,
  where: 'deleted_at IS NULL',
})
export class EmployeeDeduction extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  @Index()
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['fixed', 'percentage', 'recurring', 'variable'],
    default: 'fixed',
  })
  type: 'fixed' | 'percentage' | 'recurring' | 'variable';

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  amount?: number;

  @Column({
    name: 'percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  percentage?: number;

  @Column({
    name: 'frequency',
    type: 'enum',
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    default: 'monthly',
  })
  frequency: 'one-time' | 'quarterly' | 'monthly' | 'annually';

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
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
