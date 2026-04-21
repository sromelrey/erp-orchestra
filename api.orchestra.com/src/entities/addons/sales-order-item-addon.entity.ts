import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { Addon } from './addon.entity';
import { SalesOrderItem } from '@/entities/operations/sales-order-item.entity';

@Entity('sales_order_item_addons')
@Index(['tenantId'])
@Index(['salesOrderItemId'])
@Index(['addonId'])
export class SalesOrderItemAddon extends CommonEntity {
  @Column({ type: 'integer' })
  tenantId: number;

  @Column({ name: 'sales_order_item_id', type: 'integer' })
  salesOrderItemId: number;

  @Column({ type: 'integer' })
  addonId: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 1 })
  quantity: number;

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  // Relations
  @ManyToOne(() => Addon, (addon: Addon) => addon.salesOrderItemAddons, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'addon_id' })
  addon?: Addon;

  @ManyToOne(() => SalesOrderItem, (item) => item.addons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sales_order_item_id' })
  salesOrderItem?: SalesOrderItem;
}
