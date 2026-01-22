import { Column, Entity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from './tenant.entity';
import { SystemModule } from './system_module.entity';

@Entity({ name: 'plans', schema: 'system' })
export class Plan extends CommonEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string; // e.g., 'Starter', 'Professional', 'Enterprise'

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  monthlyPrice: number;

  @Column({ type: 'int', name: 'max_users', default: 5 })
  maxUsers: number;

  @OneToMany(() => Tenant, (tenant) => tenant.plan)
  tenants: Tenant[];

  // Many-to-Many: A Plan can have many Modules, and a Module can be in many Plans
  @ManyToMany(() => SystemModule)
  @JoinTable({
    name: 'plan_modules',
    joinColumn: { name: 'plan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'module_id', referencedColumnName: 'id' },
  })
  modules: SystemModule[];
}
