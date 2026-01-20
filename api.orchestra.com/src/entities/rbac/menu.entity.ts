import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { CommonEntity } from "@entities/index";

@Entity('menus')
@Index(['parentId', 'sortOrder'], { where: 'deleted_at IS NULL' })
export class Menu extends CommonEntity {
  @Column({ name: 'parent_id', type: 'int', nullable: true })
  @Index()
  parentId?: number | null;

  @ManyToOne('Menu', 'children', { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: any;

  @OneToMany('Menu', 'parent')
  children: any[];

  @Column({ name: 'permission_id', type: 'int', nullable: true })
  @Index()
  permissionId?: number | null;

  @ManyToOne('Permission', 'menus', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'permission_id' })
  permission?: any;

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
