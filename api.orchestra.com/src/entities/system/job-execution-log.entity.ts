import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum JobExecutionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

@Entity('job_execution_logs', { schema: 'system' })
export class JobExecutionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'job_name' })
  jobName: string;

  @Column({ type: 'json' })
  metadata: Record<string, any>;

  @Column({
    type: 'enum',
    enum: JobExecutionStatus,
  })
  status: JobExecutionStatus;

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string;

  @Column({ type: 'int', name: 'processed_count' })
  processedCount: number;

  @Column({ type: 'int', name: 'error_count' })
  errorCount: number;

  @Column({ type: 'timestamp', name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', name: 'completed_at' })
  completedAt: Date;

  @Column({ type: 'int', name: 'tenant_id' })
  tenantId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
