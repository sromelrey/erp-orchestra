import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';

/**
 * UserPermission entity for direct user-level permission overrides.
 *
 * Allows granting or denying specific permissions to individual users,
 * overriding their role-based permissions.
 */
@Entity({ name: 'user_permissions', schema: 'system' })
@Index(['userId', 'permissionId'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
export class UserPermission extends CommonEntity {
  @Column({ name: 'user_id', type: 'int' })
  @Index()
  userId: number;

  @ManyToOne('User', 'userPermissions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'permission_id', type: 'int' })
  @Index()
  permissionId: number;

  @ManyToOne('Permission', 'userPermissions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'GRANT',
  })
  type: 'GRANT' | 'DENY';

  @Column({
    name: 'granted_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  grantedAt: Date;

  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  expiresAt?: Date | null;
}
