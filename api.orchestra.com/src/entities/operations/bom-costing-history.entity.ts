import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { CostingMethod } from '@/types/enums';
import { Tenant } from '../system/tenant.entity';
import { Bom } from './bom.entity';
import { BomCosting } from './bom-costing.entity';

@Entity({ name: 'bom_costing_history', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['bomId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'costingDate'], { where: 'deleted_at IS NULL' })
export class BomCostingHistory extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'bom_id', type: 'int' })
  @Index()
  bomId: number;

  @ManyToOne(() => Bom, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bom_id' })
  bom?: Bom;

  @Column({ name: 'bom_costing_id', type: 'int', nullable: true })
  @Index()
  bomCostingId?: number | null;

  @ManyToOne(() => BomCosting, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bom_costing_id' })
  bomCosting?: BomCosting | null;

  @Column({
    type: 'enum',
    enum: CostingMethod,
    name: 'costing_method',
  })
  costingMethod: CostingMethod;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_material_cost',
  })
  totalMaterialCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_labor_cost',
  })
  totalLaborCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_overhead_cost',
  })
  totalOverheadCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_scrap_cost',
  })
  totalScrapCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'total_cost',
  })
  totalCost: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 4,
    name: 'unit_cost',
  })
  unitCost: number;

  @Column({
    type: 'numeric',
    precision: 8,
    scale: 4,
    name: 'output_quantity',
  })
  outputQuantity: number;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'cost_uom',
  })
  costUom: string;

  @Column({
    type: 'timestamp without time zone',
    name: 'costing_date',
  })
  costingDate: Date;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'change_reason',
  })
  changeReason: string;

  @Column({
    type: 'int',
    name: 'changed_by_user_id',
  })
  changedByUserId: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  previousValues?: Record<string, unknown> | null;
}
