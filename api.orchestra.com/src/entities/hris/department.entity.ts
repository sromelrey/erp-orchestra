import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';

/**
 * Represents a logical organizational grouping within a tenant.
 *
 * Examples: Engineering, Finance, Human Resources.
 * The `headEmployeeId` field is nullable and will be linked
 * to the Employee entity once it is created in a later phase.
 */
@Entity({ name: 'departments', schema: 'hris' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
export class Department extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code?: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'head_employee_id', type: 'int', nullable: true })
  headEmployeeId?: number;
}
