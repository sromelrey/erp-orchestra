import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';
import { Warehouse } from '../inventory/warehouse.entity';
import { WarehouseLocation } from '../inventory/warehouse-location.entity';
import { Item } from '../inventory/item.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { StockMovementType } from '@/types/enums';

@Entity({ name: 'stock_ledger', schema: 'operations' })
@Index(['tenantId', 'itemId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'warehouseId'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'documentDate'], { where: 'deleted_at IS NULL' })
@Index(['tenantId', 'warehouseId', 'documentDate'], {
  where: 'deleted_at IS NULL',
})
export class StockLedger extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'warehouse_id', type: 'int' })
  warehouseId: number;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse?: Warehouse;

  @Column({ name: 'location_id', type: 'int', nullable: true })
  locationId?: number | null;

  @ManyToOne(() => WarehouseLocation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' })
  location?: WarehouseLocation | null;

  @Column({ name: 'item_id', type: 'int' })
  itemId: number;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' })
  item?: Item;

  @Column({ name: 'uom_id', type: 'int' })
  uomId: number;

  @ManyToOne(() => UnitOfMeasure, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'uom_id' })
  uom?: UnitOfMeasure;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 6,
  })
  quantity: string;

  // TODO: Add migration for balance_after column
  // @Column({
  //   name: 'balance_after',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 6,
  //   nullable: true,
  // })
  // balanceAfter?: string;

  @Column({
    name: 'movement_type',
    type: 'enum',
    enum: StockMovementType,
  })
  movementType: StockMovementType;

  @Column({
    name: 'reference_type',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  referenceType?: string | null;

  @Column({
    name: 'reference_code',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  referenceCode?: string | null;

  @Column({ type: 'text', nullable: true })
  memo?: string | null;

  @Column({ name: 'document_date', type: 'timestamp without time zone' })
  documentDate: Date;
}
