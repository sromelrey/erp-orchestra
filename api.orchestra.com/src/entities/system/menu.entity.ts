import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { SystemModule } from './system-module.entity'; // Import your new Module entity
import { Permission } from './permission.entity';

@Entity({ name: 'menus', schema: 'system' })
@Index(['parentId', 'sortOrder'], { where: 'deleted_at IS NULL' })
export class Menu extends CommonEntity {
  // --- 1. Link to the System Module ---
  @Column({ name: 'module_id', type: 'int', nullable: true })
  @Index()
  moduleId?: number | null;

  @ManyToOne(() => SystemModule, (module) => module.menus, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'module_id' })
  module?: SystemModule;

  // --- 2. Self-Referencing (Hierarchy) ---
  @Column({ name: 'parent_id', type: 'int', nullable: true })
  @Index()
  parentId?: number | null;

  @ManyToOne(() => Menu, (menu) => menu.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  // --- 3. Link to RBAC Permission ---
  @Column({ name: 'permission_id', type: 'int', nullable: true })
  @Index()
  permissionId?: number | null;

  @ManyToOne(() => Permission, (perm) => perm.menus, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'permission_id' })
  permission?: Permission;

  // --- 4. UI Properties ---
  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string | null;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', name: 'is_visible', default: true })
  isVisible: boolean;
}
