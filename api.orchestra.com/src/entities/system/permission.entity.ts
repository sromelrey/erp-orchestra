import { Column, Entity, Index, OneToMany } from 'typeorm';
import { CommonEntity } from '../common.entity';

@Entity({ name: 'permissions', schema: 'system' })
@Index(['slug'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['module', 'resource', 'action'], { where: 'deleted_at IS NULL' })
export class Permission extends CommonEntity {
  @Column({ type: 'varchar', length: 50 })
  @Index()
  module: string;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  resource: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Relationships
  @OneToMany('RolePermission', 'permission')
  rolePermissions!: import('./role-permission.entity').RolePermission[];

  @OneToMany('Menu', 'permission')
  menus!: import('./menu.entity').Menu[];
}
