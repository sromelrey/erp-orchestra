import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from '@/entities/system/user.entity';

import { LoginGuard } from '@/guards/login.guard';
import { AuthService } from './providers/auth.service';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';

/**
 * Controller handling authentication-related HTTP endpoints.
 *
 * This controller provides endpoints for user login, logout, and session
 * management. It uses guards and Passport strategies for secure authentication.
 */
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param authService - Service handling authentication operations
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and establishes a session.
   *
   * This endpoint validates user credentials using the LoginGuard and
   * returns user information upon successful authentication.
   *
   * @param req - Express request object containing authenticated user data
   * @returns Object containing user and profile information
   */
  @Post('login')
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  login(
    @Req()
    req: Express.Request & {
      user?: User;
      principal?: User;
      sessionID?: string;
    },
  ) {
    const user = req.user ?? req.principal;
    console.log(
      `[AuthController] login success for user: ${user?.email}, sessionID: ${req.sessionID}`,
    );
    if (!user) {
      throw new BadRequestException('Unable to resolve authenticated user');
    }

    return this.authService.buildLoginResponse(user);
  }

  /**
   * Logs out the current user and destroys their session.
   *
   * This endpoint terminates the user's session and clears authentication state.
   *
   * @param req - Express request object for session management
   */
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req()
    req: Request,
  ) {
    console.log(`[AuthController] logging out sessionID: ${req.sessionID}`);
    await this.authService.logOut(req);
  }

  /**
   * Retrieves the authenticated user's profile information.
   *
   * This endpoint provides detailed information about the authenticated user.
   *
   * @param req - Express request object containing authenticated user data
   * @returns The user's profile
   */
  @Get('me')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Express.Request & { user?: User; principal?: User }) {
    const user = req.user ?? req.principal;
    if (!user?.id) {
      return null;
    }

    return this.authService.buildLoginResponse(user);
  }
}
