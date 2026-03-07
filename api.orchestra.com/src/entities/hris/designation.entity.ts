import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';

/**
 * Represents a job title or rank within the organization.
 *
 * Examples: Senior Developer, Area Manager, Accounting Clerk.
 * The `level` field denotes hierarchy/pay-grade level.
 */
@Entity({ name: 'designations', schema: 'hris' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
export class Designation extends CommonEntity {
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

  @Column({ type: 'int', nullable: true })
  level?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
