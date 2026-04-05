import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { GoodsIssuance } from './goods-issuance.entity';
import { Item } from './item.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';

@Entity('operations.goods_issuance_items')
@Index(['goodsIssuanceId'])
@Index(['itemId'])
export class GoodsIssuanceItem extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @Column({ name: 'goods_issuance_id', type: 'int' })
  goodsIssuanceId: number;

  @Column({ name: 'item_id', type: 'int' })
  itemId: number;

  @Column({ name: 'uom_id', type: 'int' })
  uomId: number;

  @Column({
    name: 'quantity_issued',
    type: 'decimal',
    precision: 15,
    scale: 3,
  })
  quantityIssued: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  unitPrice?: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  totalPrice?: number;

  @Column({ name: 'batch_number', type: 'varchar', length: 64, nullable: true })
  batchNumber?: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => GoodsIssuance, (issuance) => issuance.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goods_issuance_id' })
  goodsIssuance: GoodsIssuance;

  @ManyToOne(() => Item, { nullable: false })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => UnitOfMeasure, { nullable: false })
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;
}
