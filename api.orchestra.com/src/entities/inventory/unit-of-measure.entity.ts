import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';

@Entity({ name: 'units_of_measure', schema: 'inventory' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class UnitOfMeasure extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ type: 'varchar', length: 32 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'smallint', default: 2 })
  precision: number;
}
