import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

import { User } from '@/entities/system/user.entity';
import { SessionService } from '@/modules/system/sessions/session.service';

/**
 * Service handling authentication logic.
 *
 * This service manages user verification, sign-in, and session handling.
 * It interacts with the User repository to validate credentials.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Validates user credentials.
   *
   * @param email - User's email
   * @param pass - User's password
   * @returns The user entity if valid, null otherwise
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role', 'tenant'],
    });

    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        // Return user without passwordHash
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...result } = user;
        return result as User;
      }
    }
    return null;
  }

  /**
   * Logs out the user by destroying the session.
   *
   * @param req - Express request
   */
  async logOut(req: Request): Promise<void> {
    const sessionId = req.sessionID;
    if (sessionId) {
      await this.sessionService.revokeSession(sessionId);
    }

    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(new Error(String(err)));
        resolve();
      });
    });
  }

  /**
   * Builds the response object for a successful login.
   *
   * @param user - The authenticated user
   * @returns User profile data
   */
  buildLoginResponse(user: User) {
    // Aggregate unique permissions from all roles
    const permissions = new Set<string>();
    user.userRoles?.forEach((ur) => {
      ur.role?.rolePermissions?.forEach((rp) => {
        if (rp.permission?.slug) {
          permissions.add(rp.permission.slug);
        }
      });
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      tenantId: user.tenantId,
      isSystemAdmin: user.isSystemAdmin,
      roles: user.userRoles?.map((ur) => ur.role?.code).filter(Boolean) ?? [],
      permissions: Array.from(permissions),
    };
  }
}
