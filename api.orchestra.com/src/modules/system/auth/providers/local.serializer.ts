import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/entities/system/user.entity';
import { Status } from '@/types/enums';

/**
 * Passport serializer for managing user session data.
 *
 * This serializer handles the conversion between User entities and
 * session data, enabling Passport to store minimal user identifiers in
 * sessions and reconstruct full user objects when needed.
 */
@Injectable()
export class LocalSerializer extends PassportSerializer {
  /**
   * Creates an instance of LocalSerializer.
   * @param userRepository - TypeORM repository for User entity operations
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  /**
   * Serializes user data for session storage.
   *
   * Converts a User entity to a minimal identifier for session storage.
   * Only the user ID is stored in the session to minimize session size.
   *
   * @param user - The User entity to serialize
   * @param done - Callback to return the serialized user identifier
   */
  serializeUser(user: User, done: (err: Error | null, id?: number) => void) {
    done(null, user.id);
  }

  /**
   * Deserializes user data from session storage.
   *
   * Reconstructs a User entity from the stored session identifier.
   * Retrieves the full user data from the database for each request.
   *
   * @param id - The user identifier stored in the session
   * @param done - Callback to return the deserialized User entity
   */
  async deserializeUser(
    id: number,
    done: (err: Error | null, user?: User | false) => void,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          'userRoles',
          'userRoles.role',
          'userRoles.role.rolePermissions',
          'userRoles.role.rolePermissions.permission',
          'tenant',
        ],
      });

      if (!user || user.status !== Status.ACTIVE) {
        // User not found or not active - return false to indicate authentication failure
        // This will clear the invalid session
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
}
