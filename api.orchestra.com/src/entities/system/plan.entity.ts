import { Column, Entity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from './tenant.entity';
import { SystemModule } from './system-module.entity';

@Entity({ name: 'plans', schema: 'system' })
export class Plan extends CommonEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  monthlyPrice: number;

  @Column({ type: 'int', name: 'max_users', default: 5 })
  maxUsers: number;

  @OneToMany(() => Tenant, (tenant) => tenant.plan)
  tenants: Tenant[];

  @ManyToMany(() => SystemModule, (module) => module.plans)
  @JoinTable({
    name: 'plan_modules',
    schema: 'system',
    joinColumn: { name: 'plan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'module_id', referencedColumnName: 'id' },
  })
  modules: SystemModule[];
}
