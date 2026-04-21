import { Entity, Column, Index, OneToMany } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { ServiceConfiguration } from './service-configuration.entity';

@Entity({ name: 'service_options', schema: 'service_config' })
@Index(['tenantId', 'code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class ServiceOption extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @Column({ type: 'varchar', length: 64 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(
    () => ServiceConfiguration,
    (config: ServiceConfiguration) => config.serviceOption,
  )
  configurations?: ServiceConfiguration[];
}
