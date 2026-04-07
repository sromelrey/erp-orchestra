import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { GoodsReceipt } from './goods-receipt.entity';
import { Item } from '../inventory/item.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

@Entity('operations.goods_receipt_items')
export class GoodsReceiptItem extends CommonEntity {
  @Column({ name: 'goods_receipt_id', type: 'int' })
  goodsReceiptId: number;

  @Column({ name: 'item_id', type: 'int' })
  itemId: number;

  @Column({ name: 'uom_id', type: 'int' })
  uomId: number;

  @Column({
    name: 'quantity_ordered',
    type: 'decimal',
    precision: 18,
    scale: 6,
    default: 0,
  })
  quantityOrdered: number;

  @Column({
    name: 'quantity_received',
    type: 'decimal',
    precision: 18,
    scale: 6,
    default: 0,
  })
  quantityReceived: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  unitPrice: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  totalPrice: number;

  @Column({ name: 'batch_number', type: 'varchar', length: 64, nullable: true })
  batchNumber: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => GoodsReceipt, (receipt) => receipt.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goods_receipt_id' })
  goodsReceipt: GoodsReceipt;

  @ManyToOne(() => Item, { eager: false })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => UnitOfMeasure, { eager: false })
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;
}
