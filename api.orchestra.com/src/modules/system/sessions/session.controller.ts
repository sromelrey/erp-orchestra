import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequirePermission } from '@/decorators/permission.decorator';
import { SessionService } from './session.service';
import { User } from '@/entities/system/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Controller for managing user sessions.
 *
 * This controller provides endpoints for administrative operations
 * on sessions, including listing active sessions, retrieving session
 * details, and managing session lifecycle.
 */
@Controller('sessions')
@UseGuards(AuthenticatedGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * Retrieves all active sessions for the current user.
   *
   * @param req - Request object containing user info
   * @returns Array of user's active sessions
   */
  @Get('my')
  async getMySessions(@Req() req: AuthenticatedRequest) {
    const sessions = await this.sessionService.getUserActiveSessions(
      req.user.id,
    );
    // Mark current session
    return sessions.map((s) => ({
      ...s,
      current: s.id === req.sessionID, // req.sessionID is standard in express-session/connect-typeorm
    }));
  }

  /**
   * Revokes a specific session for the current user.
   *
   * @param req - Request object containing user info
   * @param id - ID of the session to revoke
   * @returns Object confirming revocation
   */
  @Delete('my/:id')
  async revokeMySession(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    // Verify the session belongs to the user
    const sessions = await this.sessionService.getUserActiveSessions(
      req.user.id,
    );
    const session = sessions.find((s) => s.id === id);

    if (!session) {
      throw new NotFoundException(
        'Session not found or does not belong to user',
      );
    }

    await this.sessionService.revokeSession(id);
    return { revoked: true };
  }

  /**
   * Retrieves all active sessions with basic information.
   *
   * @returns Array of all session records
   */
  @Get()
  @RequirePermission('session-admin', 'read')
  async getSessions() {
    return await this.sessionService.findAll();
  }

  /**
   * Retrieves all active sessions with detailed user information.
   *
   * @returns Array of sessions with user details
   */
  @Get('details')
  @RequirePermission('session-admin', 'read')
  async getSessionsWithDetails() {
    return await this.sessionService.findAllWithDetails();
  }

  /**
   * Retrieves a specific session with its associated user.
   *
   * @param id - ID of the session to retrieve
   * @returns Session with user details
   */
  @Get(':id')
  @RequirePermission('session-admin', 'read')
  async getSessionDetails(@Param('id') id: string) {
    return await this.sessionService.findOneWithDetails(id);
  }

  /**
   * Retrieves roles associated with a session's user.
   *
   * @param id - ID of the session to retrieve roles for
   * @returns Array of roles the session's user belongs to
   */
  @Get(':id/roles')
  @RequirePermission('session-admin', 'read')
  async getSessionRoles(@Param('id') id: string) {
    return await this.sessionService.getSessionRoles(id);
  }

  /**
   * Validates if a session is currently active and associated with a valid user.
   *
   * @param id - ID of the session to validate
   * @returns Object indicating if the session is valid
   */
  @Get(':id/validate')
  @RequirePermission('session-admin', 'read')
  async validateSession(@Param('id') id: string) {
    const isValid = await this.sessionService.validateSession(id);
    return { valid: isValid };
  }

  /**
   * Removes all sessions, effectively logging out all users.
   *
   * @returns Object confirming the operation was completed
   */
  @Delete()
  @RequirePermission('session-admin', 'delete')
  async deleteAll() {
    await this.sessionService.removeAll();
    return { deleted: true };
  }

  /**
   * Removes all sessions for a specific user.
   *
   * @param userId - ID of the user to remove sessions for
   * @returns Object confirming the operation was completed
   */
  @Delete('user/:userId')
  @RequirePermission('session-admin', 'delete')
  async deleteUserSessions(@Param('userId') userId: string) {
    await this.sessionService.removeUserSessions(parseInt(userId, 10));
    return { deleted: true };
  }
}
