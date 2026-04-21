import { Entity, Column, Index, OneToMany, JoinColumn } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { AddonInclusionRule } from '@/entities/addons/addon-inclusion-rule.entity';
import { SalesOrderItemAddon } from '@/entities/addons/sales-order-item-addon.entity';
import { Material } from '@/entities/inventory/material.entity';

@Entity('addons')
@Index(['tenantId', 'code'], { unique: true })
@Index(['code'])
@Index(['type'])
@Index(['isActive'])
export class Addon extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'integer' })
  tenantId: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 20, default: 'PHYSICAL' })
  type: 'PHYSICAL' | 'SERVICE';

  @Column({
    name: 'base_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  basePrice: number;

  @Column({ name: 'material_id', type: 'integer', nullable: true })
  materialId?: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => AddonInclusionRule, (rule: AddonInclusionRule) => rule.addon)
  inclusionRules?: AddonInclusionRule[];

  @OneToMany(
    () => SalesOrderItemAddon,
    (itemAddon: SalesOrderItemAddon) => itemAddon.addon,
  )
  salesOrderItemAddons?: SalesOrderItemAddon[];

  @JoinColumn({ name: 'material_id' })
  material?: Material;
}
