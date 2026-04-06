import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { StockAdjustmentType } from '@/types/enums';
import { StockAdjustmentItem } from './stock-adjustment-item.entity';
import { Tenant } from '../system/tenant.entity';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { User } from '../system/user.entity';

@Entity({ name: 'stock_adjustments', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['warehouseId'], { where: 'deleted_at IS NULL' })
@Index(['status'], { where: 'deleted_at IS NULL' })
@Index(['adjustmentDate'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'warehouseId'], { where: 'deleted_at IS NULL' })
export class StockAdjustment extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @Column({
    name: 'adjustment_number',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  adjustmentNumber: string;

  @Column({
    name: 'adjustment_type',
    type: 'enum',
    enum: StockAdjustmentType,
  })
  adjustmentType: StockAdjustmentType;

  @Column({ name: 'warehouse_id', type: 'int' })
  @Index()
  warehouseId: number;

  @Column({ name: 'location_id', type: 'int', nullable: true })
  locationId?: number;

  @Column({
    name: 'reference_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  referenceType?: string;

  @Column({ name: 'reference_id', type: 'int', nullable: true })
  referenceId?: number;

  @Column({ name: 'adjustment_date', type: 'date' })
  adjustmentDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['DRAFT', 'APPROVED', 'CANCELLED'],
    default: 'DRAFT',
  })
  status: 'DRAFT' | 'APPROVED' | 'CANCELLED';

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

  // Relationships
  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse?: Warehouse;

  @ManyToOne(() => WarehouseLocation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' })
  location?: WarehouseLocation;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approvedByUser?: User;

  @OneToMany(
    () => StockAdjustmentItem,
    (item: StockAdjustmentItem) => item.stockAdjustment,
  )
  items: StockAdjustmentItem[];
}
