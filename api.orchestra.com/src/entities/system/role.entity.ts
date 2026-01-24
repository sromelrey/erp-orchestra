import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Tenant } from './tenant.entity';
import { RoleStatus } from '@/types/enums';

@Entity({ name: 'roles', schema: 'system' })
@Index(['code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId', 'name'], { where: 'deleted_at IS NULL' })
export class Role extends CommonEntity {
  @Column({ name: 'tenant_id', type: 'int', nullable: true })
  @Index()
  tenantId?: number | null;

  @ManyToOne(() => Tenant, (tenant) => tenant.roles, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'boolean', name: 'is_system_role', default: false })
  isSystemRole: boolean;

  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.ACTIVE })
  status: RoleStatus;

  // Relationships
  @OneToMany('UserRole', 'role')
  userRoles!: import('./user-role.entity').UserRole[];

  @OneToMany('RolePermission', 'role')
  rolePermissions!: import('./role-permission.entity').RolePermission[];
}
