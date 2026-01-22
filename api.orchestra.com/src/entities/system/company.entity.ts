import { Column, Entity, Index, OneToMany } from 'typeorm';
import { CommonEntity } from '../common.entity';

@Entity({ name: 'companies', schema: 'system' })
@Index(['name'], { unique: true, where: 'deleted_at IS NULL' })
export class Company extends CommonEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  // Relationships
  @OneToMany('User', 'company')
  users: any[];

  @OneToMany('Role', 'company')
  roles: any[];
}
