import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Plan } from './plan.entity';
import { User } from './user.entity'; // Ensure this is imported
import { Role } from './role.entity'; // Ensure this is imported

@Entity({ name: 'tenants', schema: 'system' })
// Added the unique constraint on name from your company.entity.ts
@Index(['name'], { unique: true, where: 'deleted_at IS NULL' })
export class Tenant extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  slug: string; // e.g., 'acme-corp' for acme-corp.orchestra.com

  @Column({
    type: 'enum',
    enum: ['active', 'suspended', 'trial', 'deleted'],
    default: 'trial',
  })
  status: string;

  // --- Plan Relationship ---
  @Column({ name: 'plan_id', type: 'int' })
  planId: number;

  @ManyToOne(() => Plan, (plan) => plan.tenants)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  // --- Unified Business Relationships (from your company.entity) ---
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Role, (role) => role.tenant)
  roles: Role[];

  // Optional: Branding for the portal
  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl?: string;
}
