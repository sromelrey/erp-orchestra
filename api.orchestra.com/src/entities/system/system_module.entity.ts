import { Column, Entity, OneToMany, ManyToMany } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Menu } from './menu.entity';
import { Plan } from './plan.entity';

@Entity({ name: 'modules', schema: 'system' })
export class SystemModule extends CommonEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string; // e.g., 'Finance', 'Operations', 'HRIS'

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string; // e.g., 'FIN', 'OPS', 'HRIS'

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Relation to Menus: One Module owns many Menu items
  @OneToMany(() => Menu, (menu) => menu.module)
  menus: Menu[];

  // Inverse relation for Plans
  @ManyToMany(() => Plan, (plan) => plan.modules)
  plans: Plan[];
}
