import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';
import { User } from '../system/user.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { Branch } from './branch.entity';
import { Status } from '@/types/enums';

/**
 * Represents an Employee within a tenant's organizational structure.
 */
@Entity({ name: 'employees', schema: 'hris' })
@Index(['tenantId', 'employeeCode'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
@Index(['tenantId', 'status'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'departmentId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'managerId'], { where: 'deleted_at IS NULL' })
export class Employee extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  @Index({ unique: true, where: 'user_id IS NOT NULL AND deleted_at IS NULL' })
  userId?: number;

  @OneToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'department_id', type: 'int', nullable: true })
  @Index()
  departmentId?: number;

  @ManyToOne(() => Department, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ name: 'designation_id', type: 'int', nullable: true })
  @Index()
  designationId?: number;

  @ManyToOne(() => Designation, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'designation_id' })
  designation?: Designation;

  @Column({ name: 'branch_id', type: 'int', nullable: true })
  @Index()
  branchId?: number;

  @ManyToOne(() => Branch, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch?: Branch;

  @Column({ name: 'manager_id', type: 'int', nullable: true })
  @Index()
  managerId?: number;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager?: Employee;

  @Column({
    name: 'employee_code',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  employeeCode?: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate?: Date;

  @Column({
    name: 'emergency_contact',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  emergencyContact?: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;
}
