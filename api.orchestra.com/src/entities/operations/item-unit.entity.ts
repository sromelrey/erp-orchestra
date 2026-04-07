import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';
import { Item } from '../inventory/item.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

@Entity({ name: 'item_units', schema: 'operations' })
@Index(['itemId', 'uomId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'itemId'], { where: 'deleted_at IS NULL' })
export class ItemUnit extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'item_id', type: 'int' })
  itemId: number;

  @ManyToOne(() => Item, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item?: Item;

  @Column({ name: 'uom_id', type: 'int' })
  uomId: number;

  @ManyToOne(() => UnitOfMeasure, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'uom_id' })
  uom?: UnitOfMeasure;

  @Column({
    name: 'conversion_factor',
    type: 'numeric',
    precision: 18,
    scale: 6,
    default: 1,
  })
  conversionFactor: string;
}
