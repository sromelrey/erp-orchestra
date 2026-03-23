import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { CostingMethod } from '@/types/enums';
import { Tenant } from '../system/tenant.entity';
import { Bom } from './bom.entity';

@Entity({ name: 'bom_costings', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['bomId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'bomId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'costingDate'], { where: 'deleted_at IS NULL' })
export class BomCosting extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'bom_id', type: 'int' })
  @Index()
  bomId: number;

  @ManyToOne(() => Bom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bom_id' })
  bom?: Bom;

  @Column({
    type: 'enum',
    enum: CostingMethod,
    name: 'costing_method',
    default: CostingMethod.STANDARD,
  })
  costingMethod: CostingMethod = CostingMethod.STANDARD;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_material_cost',
    default: 0,
  })
  totalMaterialCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_labor_cost',
    default: 0,
  })
  totalLaborCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_overhead_cost',
    default: 0,
  })
  totalOverheadCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_scrap_cost',
    default: 0,
  })
  totalScrapCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_cost',
    default: 0,
  })
  totalCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'unit_cost',
    default: 0,
  })
  unitCost: number;

  @Column({
    type: 'numeric',
    precision: 8,
    scale: 4,
    name: 'output_quantity',
    default: 1,
  })
  outputQuantity: number;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'cost_uom',
    default: 'EA',
  })
  costUom: string;

  @Column({
    type: 'timestamp without time zone',
    name: 'costing_date',
  })
  costingDate: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean = true;

  @Column({
    type: 'timestamp without time zone',
    name: 'effective_from',
    nullable: true,
  })
  effectiveFrom?: Date | null;

  @Column({
    type: 'timestamp without time zone',
    name: 'effective_to',
    nullable: true,
  })
  effectiveTo?: Date | null;

  // Relationships
  @OneToMany('BomCostingComponent', 'bomCosting', {
    cascade: true,
  })
  components: unknown[];
}
