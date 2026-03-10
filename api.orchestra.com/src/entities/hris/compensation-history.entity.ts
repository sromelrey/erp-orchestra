import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Employee } from './employee.entity';

/**
 * Audit trail for employee compensation changes.
 * Tracks all modifications to compensation data for compliance and history.
 */
@Entity({ name: 'compensation_history', schema: 'hris' })
@Index(['employeeId', 'changedAt'], {
  where: 'deleted_at IS NULL',
})
export class CompensationHistory extends CommonEntity {
  @Column({ name: 'employee_id', type: 'int' })
  @Index()
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    name: 'field',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  field: string; // e.g., 'baseSalary', 'hourlyRate', 'overtimeRate', 'currency', etc.

  @Column({
    name: 'old_value',
    type: 'text',
    nullable: true,
  })
  oldValue?: string; // JSON string or plain value

  @Column({
    name: 'new_value',
    type: 'text',
    nullable: true,
  })
  newValue?: string; // JSON string or plain value

  @Column({
    name: 'change_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  changeReason?: string;

  @Column({
    name: 'changed_by',
    type: 'int',
    nullable: true,
  })
  changedBy?: number;

  @Column({
    name: 'changed_at',
    type: 'timestamp without time zone',
    default: () => 'NOW()',
  })
  changedAt: Date;
}
