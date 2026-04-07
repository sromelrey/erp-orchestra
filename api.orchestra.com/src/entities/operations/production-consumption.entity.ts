import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ProductionBatch } from './production-batch.entity';
import { Item } from '../inventory/item.entity';

@Entity({ name: 'production_consumption', schema: 'operations' })
@Index(['batchId'], { where: 'deleted_at IS NULL' })
@Index(['itemId'], { where: 'deleted_at IS NULL' })
export class ProductionConsumption extends CommonEntity {
  @Column({ name: 'batch_id', type: 'int' })
  @Index()
  batchId: number;

  @Column({ name: 'item_id', type: 'int' })
  @Index()
  itemId: number;

  @Column({
    name: 'planned_quantity',
    type: 'decimal',
    precision: 15,
    scale: 6,
  })
  plannedQuantity: number;

  @Column({
    name: 'actual_quantity',
    type: 'decimal',
    precision: 15,
    scale: 6,
    nullable: true,
  })
  actualQuantity?: number;

  @Column({
    name: 'waste_quantity',
    type: 'decimal',
    precision: 15,
    scale: 6,
    default: 0,
  })
  wasteQuantity: number;

  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  // Relationships
  @ManyToOne(() => ProductionBatch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch?: ProductionBatch;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' })
  item?: Item;
}
