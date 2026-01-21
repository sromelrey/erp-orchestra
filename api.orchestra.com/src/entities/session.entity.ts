import { ISession } from 'connect-typeorm';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

/**
 * Session entity for storing user session data using connect-typeorm.
 *
 * This entity implements the ISession interface required by connect-typeorm
 * for session storage in the database, enabling persistent sessions across
 * application restarts.
 */
@Entity()
export class Session implements ISession {
  /** Timestamp when the session expires */
  @Index()
  @Column('bigint')
  expiredAt = Date.now();

  /** Unique session identifier */
  @PrimaryColumn('varchar', { length: 255 })
  id = '';

  /** JSON string containing session data */
  @Column('text')
  json = '';

  /** Timestamp when the session was destroyed/deleted */
  @DeleteDateColumn()
  destroyedAt?: Date;
}
