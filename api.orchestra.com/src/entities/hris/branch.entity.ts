import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';

/**
 * Represents a physical or logical company location/branch.
 *
 * Each branch is tenant-scoped and can be assigned to employees
 * to denote their primary work location.
 */
@Entity({ name: 'branches', schema: 'hris' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
export class Branch extends CommonEntity {
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
  address?: string;

  @Column({
    name: 'contact_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  contactNumber?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'Active',
  })
  status: string;
}
