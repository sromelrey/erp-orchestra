import { Column, ManyToOne, OneToMany, JoinColumn, Index, Entity } from "typeorm";
import { CommonEntity } from "@entities/index";
import { Status } from "@/types/enums";

@Entity('users')
@Index(['email'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['companyId'], { where: 'deleted_at IS NULL' })
export class User extends CommonEntity {
  @Column({ name: 'company_id', type: 'int', nullable: true })
  @Index()
  companyId?: number | null;

  @ManyToOne('Company', 'users', { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'company_id' })
  company?: any;

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

  @Column({ name: 'last_login_at', type: 'timestamp with time zone', nullable: true })
  lastLoginAt?: Date | null;

  // Relationships
  @OneToMany('UserRole', 'user')
  userRoles: any[];
}