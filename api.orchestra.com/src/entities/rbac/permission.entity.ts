import { Column, Entity, Index, OneToMany } from "typeorm";
import { CommonEntity } from "@entities/index";

@Entity('permissions')
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

  // Relationships
  @OneToMany('RolePermission', 'permission')
  rolePermissions: any[];

  @OneToMany('Menu', 'permission')
  menus: any[];
}
