import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { SalesOrder } from './sales-order.entity';
import { Item } from '../inventory/item.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { ServiceType } from '../service-config/service-type.entity';
import { ServiceOption } from '../service-config/service-option.entity';
import { SalesOrderItemAddon } from '../addons/sales-order-item-addon.entity';

@Entity({ name: 'sales_order_items', schema: 'operations' })
@Index(['salesOrderId'], { where: 'deleted_at IS NULL' })
@Index(['itemId'], { where: 'deleted_at IS NULL' })
export class SalesOrderItem extends CommonEntity {
  @Column({ name: 'sales_order_id', type: 'int' })
  @Index()
  salesOrderId: number;

  @Column({ name: 'item_id', type: 'int' })
  @Index()
  itemId: number;

  @Column({ name: 'item_code', type: 'varchar', length: 50 })
  itemCode: string;

  @Column({ name: 'item_name', type: 'varchar', length: 255 })
  itemName: string;

  @Column({ name: 'quantity', type: 'decimal', precision: 15, scale: 6 })
  quantity: number;

  @Column({ name: 'unit_of_measure_id', type: 'int' })
  unitOfMeasureId: number;

  @Column({ name: 'unit_of_measure_code', type: 'varchar', length: 20 })
  unitOfMeasureCode: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({
    name: 'discount_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPercent: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tax_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  taxPercent: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  taxAmount: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 12, scale: 2 })
  lineTotal: number;

  @Column({
    name: 'delivered_quantity',
    type: 'decimal',
    precision: 15,
    scale: 6,
    default: 0,
  })
  deliveredQuantity: number;

  @Column({
    name: 'allocated_quantity',
    type: 'decimal',
    precision: 15,
    scale: 6,
    default: 0,
  })
  allocatedQuantity: number;

  @Column({ name: 'warehouse_id', type: 'int' })
  warehouseId: number;

  @Column({ name: 'warehouse_name', type: 'varchar', length: 255 })
  warehouseName: string;

  @Column({ name: 'location_id', type: 'int' })
  locationId: number;

  @Column({ name: 'location_name', type: 'varchar', length: 255 })
  locationName: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  // Service Configuration fields
  @Column({ name: 'service_type_id', type: 'int', nullable: true })
  serviceTypeId?: number;

  @Column({ name: 'service_option_id', type: 'int', nullable: true })
  serviceOptionId?: number;

  @Column({ name: 'label_source', type: 'varchar', length: 50, nullable: true })
  labelSource?: string;

  // Relationships
  @ManyToOne(() => SalesOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => UnitOfMeasure, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unit_of_measure_id' })
  unitOfMeasure: UnitOfMeasure;

  @ManyToOne(() => ServiceType, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_type_id' })
  serviceType?: ServiceType;

  @ManyToOne(() => ServiceOption, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_option_id' })
  serviceOption?: ServiceOption;

  @OneToMany(() => SalesOrderItemAddon, (addon) => addon.salesOrderItem)
  addons?: SalesOrderItemAddon[];
}
