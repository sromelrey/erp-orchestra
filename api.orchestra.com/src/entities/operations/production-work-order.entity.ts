import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { ProductionBatch, ProductionStatus } from './production-batch.entity';

@Entity({ name: 'production_work_orders', schema: 'operations' })
@Index(['batchId'], { where: 'deleted_at IS NULL' })
@Index(['status'], { where: 'deleted_at IS NULL' })
export class ProductionWorkOrder extends CommonEntity {
  @Column({ name: 'batch_id', type: 'int' })
  @Index()
  batchId: number;

  @Column({ name: 'step_name', type: 'varchar', length: 100 })
  stepName: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ProductionStatus,
    default: ProductionStatus.PLANNED,
  })
  status: ProductionStatus;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ name: 'finished_at', type: 'timestamp', nullable: true })
  finishedAt?: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(() => ProductionBatch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch?: ProductionBatch;
}
