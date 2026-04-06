import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { StockTransfer } from './stock-transfer.entity';
import { Tenant } from '../system/tenant.entity';
import { Material } from '../inventory/material.entity';

@Entity({ name: 'stock_transfer_items', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['stockTransferId'], { where: 'deleted_at IS NULL' })
@Index(['itemId'], { where: 'deleted_at IS NULL' })
@Index(['batchNumber'], { where: 'deleted_at IS NULL' })
export class StockTransferItem extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @Column({ name: 'stock_transfer_id', type: 'int' })
  @Index()
  stockTransferId: number;

  @Column({ name: 'item_id', type: 'int' })
  @Index()
  itemId: number;

  @Column({
    name: 'quantity_transferred',
    type: 'decimal',
    precision: 15,
    scale: 6,
  })
  quantityTransferred: number;

  @Column({
    name: 'quantity_received',
    type: 'decimal',
    precision: 15,
    scale: 6,
    default: 0,
  })
  quantityReceived: number;

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

  @ManyToOne(() => StockTransfer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_transfer_id' })
  stockTransfer: StockTransfer;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' })
  item?: Material;
}
