import {
  Entity,
  Column,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { GoodsReceiptItem } from './goods-receipt-item.entity';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';

export enum GoodsReceiptType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  PRODUCTION = 'PRODUCTION',
  RETURN = 'RETURN',
  MANUAL = 'MANUAL',
}

export enum GoodsReceiptStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity('operations.goods_receipts')
@Index(['tenantId', 'receiptNumber'], { unique: true })
@Index(['status'])
@Index(['receiptDate'])
export class GoodsReceipt extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @Column({ name: 'receipt_number', type: 'varchar', length: 64 })
  receiptNumber: string;

  @Column({
    name: 'receipt_type',
    type: 'enum',
    enum: GoodsReceiptType,
  })
  receiptType: GoodsReceiptType;

  @Column({
    name: 'reference_type',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  referenceType: string;

  @Column({
    name: 'reference_code',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  referenceCode: string;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId: number;

  @Column({ name: 'warehouse_id', type: 'int' })
  warehouseId: number;

  @Column({ name: 'location_id', type: 'int', nullable: true })
  locationId: number;

  @Column({ name: 'receipt_date', type: 'timestamp' })
  receiptDate: Date;

  @Column({ name: 'expected_date', type: 'timestamp', nullable: true })
  expectedDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: GoodsReceiptStatus,
    default: GoodsReceiptStatus.DRAFT,
  })
  status: GoodsReceiptStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 18,
    scale: 6,
    default: 0,
  })
  totalQuantity: number;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalValue: number;

  // Relations
  @OneToMany(() => GoodsReceiptItem, (item) => item.goodsReceipt, {
    cascade: true,
  })
  items: GoodsReceiptItem[];

  @ManyToOne(() => Warehouse, { eager: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseLocation, { eager: false })
  @JoinColumn({ name: 'location_id' })
  location: WarehouseLocation;
}
