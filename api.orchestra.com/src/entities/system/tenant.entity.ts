import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Plan } from './plan.entity';

@Entity({ name: 'tenants', schema: 'system' })
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

  @Column({ name: 'plan_id', type: 'int' })
  planId: number;

  @ManyToOne(() => Plan, (plan) => plan.tenants)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  // Optional: Branding for the portal
  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl?: string;
}
