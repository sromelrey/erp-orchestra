import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { Addon } from './addon.entity';

export enum RuleType {
  MIN_QTY = 'MIN_QTY',
  QUANTITY_THRESHOLD = 'QUANTITY_THRESHOLD',
  ORDER_TOTAL = 'ORDER_TOTAL',
}

@Entity('addon_inclusion_rules')
@Index(['tenantId'])
@Index(['addonId'])
@Index(['isActive'])
export class AddonInclusionRule extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'integer' })
  tenantId: number;

  @Column({ name: 'addon_id', type: 'integer' })
  addonId: number;

  @Column({
    name: 'rule_type',
    type: 'enum',
    enum: RuleType,
    default: RuleType.MIN_QTY,
  })
  ruleType: RuleType;

  @Column({ name: 'threshold_value', type: 'numeric', precision: 10, scale: 2 })
  thresholdValue: number;

  @Column({
    name: 'discount_percent',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 100.0,
  })
  discountPercent: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Addon, (addon) => addon.inclusionRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'addon_id' })
  addon?: Addon;
}
