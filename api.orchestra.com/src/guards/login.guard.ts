import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Guard that handles local authentication (username/password) and session establishment.
 *
 * This guard extends Passport's AuthGuard with 'local' strategy to authenticate
 * users via traditional login credentials. On successful authentication, it
 * establishes a session and logs the user in. Failed authentication attempts
 * are logged for security monitoring.
 */
@Injectable()
export class LoginGuard extends AuthGuard('local') {
  /** Logger instance for security monitoring and error tracking */
  private readonly logger = new Logger();

  /**
   * Attempts to authenticate the user and establish a session.
   *
   * This method performs local authentication using the configured Passport strategy,
   * and if successful, establishes a user session. Authentication failures are
   * logged for security monitoring.
   *
   * @param context - The execution context containing request details
   * @returns Promise resolving to true if authentication succeeds, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      return result;
    } catch (e: any) {
      if (e instanceof HttpException) {
        this.logger.error(
          `[${context.getClass().name}] [${e.name}] Invoking method: ${context.getHandler().name}`,
        );
      } else {
        this.logger.error(e);
      }
      return false;
    }
  }
}
