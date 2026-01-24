import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { MaterialType } from '@/types/enums';

import { Tenant } from '../system/tenant.entity';

@Entity({ name: 'materials', schema: 'operations' })
@Index(['sku'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'materialType'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'materialGroup'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'isActive'], { where: 'deleted_at IS NULL' })
export class Material extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    type: 'enum',
    enum: MaterialType,
    name: 'material_type',
    nullable: true,
  })
  materialType?: MaterialType | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'material_group',
    nullable: true,
  })
  materialGroup?: string | null;

  @Column({ type: 'varchar', length: 10, name: 'base_uom' })
  baseUom: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 4,
    name: 'net_weight',
    nullable: true,
  })
  netWeight?: number | null;

  @Column({ type: 'varchar', length: 10, name: 'weight_uom', nullable: true })
  weightUom?: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Relationships
  @OneToMany('Bom', 'parentMaterial')
  boms: any[];

  @OneToMany('BomItem', 'componentMaterial')
  bomItems: any[];
}
