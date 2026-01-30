import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Session } from '@/entities/system/session.entity';
import { User } from '@/entities/system/user.entity';
import { UserRole } from '@/entities/system/user-role.entity';
import { Status } from '@/types/enums';

/**
 * Interface for parsed session data structure
 */
interface SessionData {
  passport?: {
    user?: number;
  };
}

/**
 * Parse session JSON safely with type guard
 */
function parseSessionData(json: string): SessionData | null {
  try {
    const data: unknown = JSON.parse(json);
    if (typeof data === 'object' && data !== null) {
      return data as SessionData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Service for managing user session data.
 *
 * This service provides operations for session management, primarily used
 * by the connect-typeorm package for session storage. Additional methods
 * are provided for administrative session operations.
 */
@Injectable()
export class SessionService {
  /**
   * Creates an instance of SessionService.
   * @param repository - TypeORM repository for Session entity (used by connect-typeorm)
   */
  constructor(
    @InjectRepository(Session)
    public readonly repository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  // Core connect-typeorm session management is handled automatically

  /**
   * Retrieves all active sessions from the database.
   *
   * @returns Array of all session records
   */
  async findAll() {
    return await this.repository.find({});
  }

  /**
   * Retrieves all active sessions with associated user data.
   *
   * This enhanced method provides more context about active sessions,
   * including user information and session expiration.
   *
   * @returns Array of sessions with user details
   */
  async findAllWithDetails() {
    const sessions = await this.repository.find({});
    const enrichedSessions: Array<{
      id: string;
      expiredAt: Date;
      user: Partial<User>;
    }> = [];

    for (const session of sessions) {
      // Parse session data to get user ID
      const sessionData = parseSessionData(session.json);
      const userId = sessionData?.passport?.user;

      if (userId) {
        const user = await this.userRepo.findOne({
          where: { id: userId },
          select: [
            'id',
            'email',
            'firstName',
            'lastName',
            'status',
            'tenantId',
            'isSystemAdmin',
          ] as (keyof User)[],
        });

        if (user) {
          enrichedSessions.push({
            id: session.id,
            expiredAt: new Date(session.expiredAt),
            user,
          });
        }
      }
    }

    return enrichedSessions;
  }

  /**
   * Gets a specific session by ID with associated user data.
   *
   * @param sessionId - ID of the session to retrieve
   * @returns Session with user details
   * @throws NotFoundException if session doesn't exist
   */
  async findOneWithDetails(sessionId: string) {
    const session = await this.repository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Parse session data to get user ID
    const sessionData = parseSessionData(session.json);
    const userId = sessionData?.passport?.user;

    if (userId) {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'status',
          'tenantId',
          'isSystemAdmin',
        ] as (keyof User)[],
      });

      if (user) {
        return {
          id: session.id,
          expiredAt: new Date(session.expiredAt),
          user,
        };
      }
    }

    throw new NotFoundException('Session has no associated user');
  }

  /**
   * Retrieves user's roles from active session.
   *
   * @param sessionId - ID of the session
   * @returns Array of roles the user has
   * @throws NotFoundException if session doesn't exist or has invalid data
   */
  async getSessionRoles(sessionId: string) {
    const sessionWithDetails = await this.findOneWithDetails(sessionId);
    const userId = sessionWithDetails.user.id;

    if (!userId) {
      throw new NotFoundException('User ID not found in session');
    }

    // Get role memberships for this user
    const userRoles = await this.userRoleRepo.find({
      where: {
        userId: userId,
      },
      relations: ['role'],
    });

    // Map to role details - filter out undefined roles and map to details
    const roles = userRoles
      .filter(
        (ur): ur is typeof ur & { role: NonNullable<typeof ur.role> } =>
          ur.role !== null && ur.role !== undefined,
      )
      .map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        code: ur.role.code,
      }));

    return roles;
  }

  /**
   * Validates if a session is associated with an active user.
   *
   * @param sessionId - ID of the session to validate
   * @returns True if session is valid, false otherwise
   */
  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const session = await this.repository.findOne({
        where: { id: sessionId },
      });
      if (!session) return false;

      // Check if session is expired
      if (session.expiredAt < Date.now()) return false;

      // Parse session data to get user ID
      const sessionData = parseSessionData(session.json);
      const userId = sessionData?.passport?.user;

      if (!userId) return false;

      // Verify user exists and is active
      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: ['status'] as (keyof User)[],
      });

      return user?.status === Status.ACTIVE;
    } catch {
      return false;
    }
  }

  /**
   * Revokes a specific session by ID.
   *
   * @param sessionId - ID of the session to revoke
   */
  async revokeSession(sessionId: string) {
    await this.repository.delete(sessionId);
  }

  /**
   * Revokes all sessions for a specific user.
   *
   * @param userId - ID of the user
   */
  async revokeAllSessions(userId: number) {
    return this.removeUserSessions(userId);
  }

  /**
   * Retrieves all active sessions for a specific user.
   *
   * @param userId - ID of the user
   * @returns Array of user's active sessions
   */
  async getUserActiveSessions(userId: number) {
    const sessions = await this.repository.find();
    const userSessions: Array<{
      id: string;
      expiredAt: Date;
      ip?: string;
      userAgent?: string;
      current: boolean; // Flag to indicate if this is the current session (caller needs to check against their session ID)
    }> = [];

    for (const session of sessions) {
      const sessionData = parseSessionData(session.json);
      if (sessionData?.passport?.user === userId) {
        // Try to extract extra info if available in the future.
        // For now, connect-typeorm/express-session default store doesn't easily expose IP/UA unless we customize the session object.
        // We will return basic info.
        userSessions.push({
          id: session.id,
          expiredAt: new Date(session.expiredAt),
          current: false, // Calculated by controller or caller
        });
      }
    }

    return userSessions;
  }

  /**
   * Removes all sessions from the database.
   *
   * This operation clears all session data and will log out all users.
   */
  async removeAll() {
    await this.repository.clear();
  }

  /**
   * Removes all sessions for a specific user.
   *
   * @param userId - ID of the user to remove sessions for
   */
  async removeUserSessions(userId: number) {
    const sessions = await this.repository.find();

    for (const session of sessions) {
      const sessionData = parseSessionData(session.json);
      if (sessionData?.passport?.user === userId) {
        await this.repository.delete(session.id);
      }
    }
  }
}
