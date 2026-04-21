import { Entity, Column, Index } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';

@Entity({ name: 'service_conditions', schema: 'service_config' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class ServiceCondition extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @Column({ type: 'varchar', length: 64 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb', default: [] })
  values: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
