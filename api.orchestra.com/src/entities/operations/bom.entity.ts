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

@Entity({ name: 'boms', schema: 'operations' })
@Index(['companyId'], { where: 'deleted_at IS NULL' })
@Index(['parentMaterialId'], { where: 'deleted_at IS NULL' })
@Index(['companyId', 'parentMaterialId'], { where: 'deleted_at IS NULL' })
@Index(['companyId', 'status'], { where: 'deleted_at IS NULL' })
@Index(['parentMaterialId', 'version'], { where: 'deleted_at IS NULL' })
export class Bom extends CommonEntity {
  @Column({ name: 'company_id', type: 'int' })
  @Index()
  companyId: number;

  @ManyToOne('Company', 'boms', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company?: any;

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
