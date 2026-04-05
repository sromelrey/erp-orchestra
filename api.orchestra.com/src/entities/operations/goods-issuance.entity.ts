import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { GoodsIssuanceItem } from './goods-issuance-item.entity';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';

export enum GoodsIssuanceType {
  PRODUCTION = 'PRODUCTION',
  SALES = 'SALES',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
}

export enum GoodsIssuanceStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  ISSUED = 'ISSUED',
  CANCELLED = 'CANCELLED',
}

export enum GoodsIssuanceReferenceType {
  PRODUCTION_ORDER = 'PRODUCTION_ORDER',
  SALES_ORDER = 'SALES_ORDER',
  TRANSFER_ORDER = 'TRANSFER_ORDER',
  ADJUSTMENT_REASON = 'ADJUSTMENT_REASON',
  RETURN_ORDER = 'RETURN_ORDER',
  NONE = 'NONE',
}

@Entity('operations.goods_issuances')
@Index(['tenantId'])
@Index(['issuanceNumber'])
@Index(['issuanceType'])
@Index(['status'])
@Index(['issuanceDate'])
@Index(['warehouseId'])
@Index(['issuedToDepartmentId'])
export class GoodsIssuance extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @Column({
    name: 'issuance_number',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  issuanceNumber: string;

  @Column({
    name: 'issuance_type',
    type: 'enum',
    enum: GoodsIssuanceType,
  })
  issuanceType: GoodsIssuanceType;

  @Column({
    name: 'reference_type',
    type: 'enum',
    enum: GoodsIssuanceReferenceType,
    nullable: true,
  })
  referenceType: GoodsIssuanceReferenceType;

  @Column({
    name: 'reference_code',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  referenceCode: string;

  @Column({ name: 'issued_to_department_id', type: 'int', nullable: true })
  issuedToDepartmentId: number;

  @Column({ name: 'cost_center_id', type: 'int', nullable: true })
  costCenterId: number;

  @Column({ name: 'warehouse_id', type: 'int' })
  warehouseId: number;

  @Column({ name: 'location_id', type: 'int', nullable: true })
  locationId: number;

  @Column({ name: 'issuance_date', type: 'timestamp' })
  issuanceDate: Date;

  @Column({ name: 'expected_date', type: 'timestamp', nullable: true })
  expectedDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: GoodsIssuanceStatus,
    default: GoodsIssuanceStatus.DRAFT,
  })
  status: GoodsIssuanceStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 15,
    scale: 3,
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

  @Column({ name: 'approved_by', type: 'int', nullable: true })
  approvedBy: number;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseLocation, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location: WarehouseLocation;

  @OneToMany(() => GoodsIssuanceItem, (item) => item.goodsIssuance, {
    cascade: true,
  })
  items: GoodsIssuanceItem[];
}
