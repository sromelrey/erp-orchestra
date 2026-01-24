import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Guard that ensures the user is authenticated before allowing access to protected routes.
 *
 * This guard checks if a user session exists and is valid. It supports both
 * Passport.js authentication helpers and custom principal-based authentication.
 * Routes protected by this guard require the user to be logged in.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  /**
   * Determines if the current request can proceed based on authentication status.
   *
   * @param context - The execution context containing request details
   * @returns true if the user is authenticated, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<
      Express.Request & {
        isAuthenticated?: () => boolean;
        user?: unknown;
      }
    >();
    // Prefer passport's helper if available, otherwise rely on principal presence
    if (typeof req.isAuthenticated === 'function') {
      return req.isAuthenticated();
    }
    return !!req.user;
  }
}
