import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';

@Entity({ name: 'bom_items', schema: 'operations' })
@Index(['bomId'], { where: 'deleted_at IS NULL' })
@Index(['componentMaterialId'], { where: 'deleted_at IS NULL' })
@Index(['bomId', 'componentMaterialId'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
@Index(['bomId', 'sortOrder'], { where: 'deleted_at IS NULL' })
export class BomItem extends CommonEntity {
  @Column({ name: 'bom_id', type: 'int' })
  @Index()
  bomId: number;

  @ManyToOne('Bom', 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bom_id' })
  bom: any;

  @Column({ name: 'component_material_id', type: 'int' })
  @Index()
  componentMaterialId: number;

  @ManyToOne('Material', 'bomItems', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'component_material_id' })
  componentMaterial: any;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 4,
  })
  quantity: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  uom?: string | null;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    name: 'scrap_percentage',
    default: 0,
  })
  scrapPercentage: number;

  @Column({ type: 'int', name: 'sort_order', nullable: true })
  sortOrder?: number | null;
}
