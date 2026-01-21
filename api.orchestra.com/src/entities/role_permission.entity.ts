import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('role_permissions')
@Index(['roleId', 'permissionId'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
export class RolePermission extends CommonEntity {
  @Column({ name: 'role_id', type: 'int' })
  @Index()
  roleId: number;

  @ManyToOne('Role', 'rolePermissions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: any;

  @Column({ name: 'permission_id', type: 'int' })
  @Index()
  permissionId: number;

  @ManyToOne('Permission', 'rolePermissions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: any;
}
