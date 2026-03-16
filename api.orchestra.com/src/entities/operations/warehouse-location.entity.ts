import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from '../system/tenant.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ name: 'warehouse_locations', schema: 'operations' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class WarehouseLocation extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ name: 'warehouse_id', type: 'int' })
  warehouseId: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse?: Warehouse;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId?: number | null;

  @ManyToOne(() => WarehouseLocation, (location) => location.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: WarehouseLocation | null;

  @OneToMany(() => WarehouseLocation, (location) => location.parent)
  children?: WarehouseLocation[];

  @Column({ type: 'varchar', length: 64 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 512 })
  path: string;

  @Column({ type: 'smallint', default: 0 })
  depth: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
