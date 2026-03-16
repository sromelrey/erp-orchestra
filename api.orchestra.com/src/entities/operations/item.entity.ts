import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';
import { ItemCategory } from './item-category.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';

@Entity({ name: 'items', schema: 'operations' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class Item extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
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

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId?: number | null;

  @ManyToOne(() => ItemCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: ItemCategory | null;

  @Column({ name: 'base_uom_id', type: 'int' })
  baseUomId: number;

  @ManyToOne(() => UnitOfMeasure, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'base_uom_id' })
  baseUom?: UnitOfMeasure;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
