import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ProductionWorkOrder } from './production-work-order.entity';
import { ProductionConsumption } from './production-consumption.entity';
import { Tenant } from '../system/tenant.entity';
import { Bom } from './bom.entity';

export enum ProductionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'production_batches', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['bomId'], { where: 'deleted_at IS NULL' })
@Index(['status'], { where: 'deleted_at IS NULL' })
@Index(['batchNo'], { where: 'deleted_at IS NULL' })
export class ProductionBatch extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @Column({
    name: 'batch_no',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  batchNo: string;

  @Column({ name: 'bom_id', type: 'int' })
  @Index()
  bomId: number;

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
    name: 'status',
    type: 'enum',
    enum: ProductionStatus,
    default: ProductionStatus.PLANNED,
  })
  status: ProductionStatus;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @ManyToOne(() => Bom, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bom_id' })
  bom?: Bom;

  @OneToMany('ProductionWorkOrder', 'batch')
  workOrders: ProductionWorkOrder[];

  @OneToMany('ProductionConsumption', 'batch')
  consumptions: ProductionConsumption[];
}
