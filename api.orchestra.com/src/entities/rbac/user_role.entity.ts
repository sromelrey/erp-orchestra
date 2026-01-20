import { Column, Entity, Index, ManyToOne, JoinColumn } from "typeorm";
import { CommonEntity } from "@entities/index";

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true, where: 'deleted_at IS NULL' })
export class UserRole extends CommonEntity {
  @Column({ name: 'user_id', type: 'int' })
  @Index()
  userId: number;

  @ManyToOne('User', 'userRoles', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column({ name: 'role_id', type: 'int' })
  @Index()
  roleId: number;

  @ManyToOne('Role', 'userRoles', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: any;

  @Column({ name: 'assigned_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp with time zone', nullable: true })
  expiresAt?: Date | null;
}