import { Column, Entity, OneToMany, ManyToMany } from 'typeorm';
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

  @OneToMany(() => Menu, (menu) => menu.module)
  menus: Menu[];

  @ManyToMany(() => Plan, (plan) => plan.modules)
  plans: Plan[];
}
