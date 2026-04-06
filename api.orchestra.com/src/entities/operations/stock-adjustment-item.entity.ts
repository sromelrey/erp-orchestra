import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { StockAdjustment } from './stock-adjustment.entity';
import { Tenant } from '../system/tenant.entity';
import { Material } from '../inventory/material.entity';

@Entity({ name: 'stock_adjustment_items', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['stockAdjustmentId'], { where: 'deleted_at IS NULL' })
@Index(['itemId'], { where: 'deleted_at IS NULL' })
@Index(['batchNumber'], { where: 'deleted_at IS NULL' })
export class StockAdjustmentItem extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @Column({ name: 'stock_adjustment_id', type: 'int' })
  @Index()
  stockAdjustmentId: number;

  @Column({ name: 'item_id', type: 'int' })
  @Index()
  itemId: number;

  @Column({
    name: 'quantity_adjusted',
    type: 'decimal',
    precision: 15,
    scale: 6,
  })
  quantityAdjusted: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  unitCost?: number;

  @Column({
    name: 'total_cost',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalCost: number;

  @Column({
    name: 'batch_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  batchNumber?: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => StockAdjustment, (adj: StockAdjustment) => adj.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_adjustment_id' })
  stockAdjustment: StockAdjustment;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' })
  item?: Material;
}
