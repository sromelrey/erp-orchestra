import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { BomStatus } from '@/types/enums';

import { Tenant } from '../system/tenant.entity';

@Entity({ name: 'boms', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['parentMaterialId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'parentMaterialId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'status'], { where: 'deleted_at IS NULL' })
@Index(['parentMaterialId', 'version'], { where: 'deleted_at IS NULL' })
export class Bom extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'parent_material_id', type: 'int' })
  @Index()
  parentMaterialId: number;

  @ManyToOne('Material', 'boms', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'parent_material_id' })
  parentMaterial: any;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string | null;

  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version: string;

  @Column({
    type: 'enum',
    enum: BomStatus,
    default: BomStatus.DRAFT,
  })
  status: BomStatus;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Relationships
  @OneToMany('BomItem', 'bom')
  items: any[];
}
