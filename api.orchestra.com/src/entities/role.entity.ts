import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { RoleStatus } from '@/types/enums';

@Entity('roles')
@Index(['code'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['companyId', 'name'], { where: 'deleted_at IS NULL' })
export class Role extends CommonEntity {
  @Column({ name: 'company_id', type: 'int', nullable: true })
  @Index()
  companyId?: number | null;

  @ManyToOne('Company', 'roles', { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'company_id' })
  company?: any;

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
  userRoles: any[];

  @OneToMany('RolePermission', 'role')
  rolePermissions: any[];
}
