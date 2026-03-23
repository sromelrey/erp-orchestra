import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { CostComponentType } from '@/types/enums';
import { Tenant } from '../system/tenant.entity';
import { BomCosting } from './bom-costing.entity';
import { Material } from '../inventory/material.entity';

@Entity({ name: 'bom_costing_components', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['bomCostingId'], { where: 'deleted_at IS NULL' })
@Index(['componentMaterialId'], { where: 'deleted_at IS NULL' })
export class BomCostingComponent extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'bom_costing_id', type: 'int' })
  @Index()
  bomCostingId: number;

  @ManyToOne(() => BomCosting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bom_costing_id' })
  bomCosting?: BomCosting;

  @Column({ name: 'component_material_id', type: 'int' })
  @Index()
  componentMaterialId: number;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'component_material_id' })
  componentMaterial?: Material;

  @Column({
    type: 'enum',
    enum: CostComponentType,
    name: 'cost_component_type',
    default: CostComponentType.MATERIAL,
  })
  costComponentType: CostComponentType = CostComponentType.MATERIAL;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 4,
    name: 'required_quantity',
  })
  requiredQuantity: number;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'quantity_uom',
  })
  quantityUom: string;

  @Column({
    type: 'numeric',
    precision: 8,
    scale: 4,
    name: 'scrap_percentage',
    default: 0,
  })
  scrapPercentage: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 4,
    name: 'effective_quantity',
  })
  effectiveQuantity: number;

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
    precision: 15,
    scale: 4,
    name: 'total_cost',
    default: 0,
  })
  totalCost: number;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'cost_source',
    nullable: true,
  })
  costSource?: string | null;

  @Column({
    type: 'timestamp without time zone',
    name: 'cost_date',
    nullable: true,
  })
  costDate?: Date | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string | null;
}
