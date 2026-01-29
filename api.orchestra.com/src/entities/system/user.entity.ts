import {
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Entity,
} from 'typeorm';
import { CommonEntity } from '../common.entity';
import { Status } from '@/types/enums';
import { Tenant } from './tenant.entity';

@Entity({ name: 'users', schema: 'system' })
@Index(['email'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['tenantId'], { where: 'deleted_at IS NULL' })
export class User extends CommonEntity {
  @Column({ name: 'id', type: 'int', primary: true, generated: 'increment' })
  id: number;

  @Column({ name: 'tenant_id', type: 'int', nullable: true })
  @Index()
  tenantId?: number | null;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name', nullable: true })
  firstName?: string | null;

  @Column({ type: 'varchar', length: 100, name: 'last_name', nullable: true })
  lastName?: string | null;

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'boolean', name: 'is_system_admin', default: false })
  isSystemAdmin: boolean;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column({
    name: 'last_login_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastLoginAt?: Date | null;

  // Relationships
  @OneToMany('UserRole', 'user')
  userRoles!: import('./user-role.entity').UserRole[];

  @OneToMany('UserPermission', 'user')
  userPermissions!: import('./user-permission.entity').UserPermission[];
}
