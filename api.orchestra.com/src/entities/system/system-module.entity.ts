import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Menu } from './menu.entity';
import { Plan } from './plan.entity';

@Entity({ name: 'modules', schema: 'system' })
export class SystemModule extends CommonEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // New Column: Identifies if it's a top-level Module or a Sub-module
  @Column({
    type: 'enum',
    enum: ['MODULE', 'SUB_MODULE'],
    default: 'MODULE',
  })
  type: string;

  // The Self-Reference: Links a sub-module to its parent
  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId?: number | null;

  @ManyToOne(() => SystemModule, (module) => module.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: SystemModule;

  @OneToMany(() => SystemModule, (module) => module.parent)
  children: SystemModule[];

  @OneToMany(() => Menu, (menu) => menu.module)
  menus: Menu[];

  @ManyToMany(() => Plan, (plan) => plan.modules)
  plans: Plan[];
}
