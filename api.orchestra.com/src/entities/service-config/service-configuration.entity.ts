import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '@/entities/common.entity';
import { ServiceType } from './service-type.entity';
import { ServiceOption } from './service-option.entity';
import { Bom } from '@/entities/operations/bom.entity';

@Entity({ name: 'service_configurations', schema: 'service_config' })
@Index(
  [
    'tenantId',
    'serviceTypeId',
    'serviceOptionId',
    'conditionKey',
    'conditionValue',
  ],
  {
    unique: true,
    where: 'deleted_at IS NULL',
  },
)
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['serviceTypeId'], { where: 'deleted_at IS NULL' })
@Index(['serviceOptionId'], { where: 'deleted_at IS NULL' })
@Index(['bomId'], { where: 'deleted_at IS NULL' })
export class ServiceConfiguration extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @Column({ name: 'service_type_id', type: 'int' })
  serviceTypeId: number;

  @Column({ name: 'service_option_id', type: 'int' })
  serviceOptionId: number;

  @Column({
    name: 'condition_key',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  conditionKey?: string | null;

  @Column({
    name: 'condition_value',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  conditionValue?: string | null;

  @Column({ name: 'bom_id', type: 'int', nullable: true })
  bomId?: number | null;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => ServiceType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_type_id' })
  serviceType?: ServiceType;

  @ManyToOne(() => ServiceOption, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_option_id' })
  serviceOption?: ServiceOption;

  @ManyToOne(() => Bom, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bom_id' })
  bom?: Bom;
}
