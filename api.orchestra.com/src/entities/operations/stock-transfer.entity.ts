import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { StockTransferItem } from './stock-transfer-item.entity';
import { Tenant } from '../system/tenant.entity';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { User } from '../system/user.entity';

@Entity({ name: 'stock_transfers', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['sourceWarehouseId'], { where: 'deleted_at IS NULL' })
@Index(['destinationWarehouseId'], { where: 'deleted_at IS NULL' })
@Index(['status'], { where: 'deleted_at IS NULL' })
@Index(['transferDate'], { where: 'deleted_at IS NULL' })
export class StockTransfer extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @Column({
    name: 'transfer_number',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  transferNumber: string;

  @Column({ name: 'source_warehouse_id', type: 'int' })
  @Index()
  sourceWarehouseId: number;

  @Column({ name: 'source_location_id', type: 'int', nullable: true })
  sourceLocationId?: number;

  @Column({ name: 'destination_warehouse_id', type: 'int' })
  @Index()
  destinationWarehouseId: number;

  @Column({ name: 'destination_location_id', type: 'int', nullable: true })
  destinationLocationId?: number;

  @Column({ name: 'transfer_date', type: 'date' })
  transferDate: Date;

  @Column({ name: 'expected_date', type: 'date', nullable: true })
  expectedDate?: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 15,
    scale: 6,
    default: 0,
  })
  totalQuantity: number;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalValue: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'approved_by', type: 'int', nullable: true })
  approvedBy?: number;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt?: Date;

  @Column({ name: 'received_by', type: 'int', nullable: true })
  receivedBy?: number;

  // Relationships
  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'source_warehouse_id' })
  sourceWarehouse?: Warehouse;

  @ManyToOne(() => WarehouseLocation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'source_location_id' })
  sourceLocation?: WarehouseLocation;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'destination_warehouse_id' })
  destinationWarehouse?: Warehouse;

  @ManyToOne(() => WarehouseLocation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'destination_location_id' })
  destinationLocation?: WarehouseLocation;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approvedByUser?: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'received_by' })
  receivedByUser?: User;

  @OneToMany(
    () => StockTransferItem,
    (item: StockTransferItem) => item.stockTransfer,
  )
  items: StockTransferItem[];
}
