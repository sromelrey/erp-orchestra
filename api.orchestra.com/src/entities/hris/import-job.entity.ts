import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobStatus } from '@/types/enums';

@Entity({ name: 'hris_import_jobs', schema: 'hris' })
export class ImportJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'tenant_id' })
  tenantId: number;

  @Column({ name: 'requested_by' })
  requestedBy: number;

  @Column({ name: 'file_key' })
  fileKey: string;

  @Column({ name: 'dataset' })
  dataset: string;

  @Column({ name: 'client_request_id', nullable: true })
  clientRequestId?: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.PENDING })
  status: JobStatus;

  @Column({ name: 'progress', type: 'float', default: 0 })
  progress: number;

  @Column({ name: 'error', type: 'text', nullable: true })
  error?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
