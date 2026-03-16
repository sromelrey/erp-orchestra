import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';

@Entity({ name: 'item_categories', schema: 'operations' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class ItemCategory extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ type: 'varchar', length: 64 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;
}
