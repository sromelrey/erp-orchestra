import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/decorators/roles.decorator';

/**
 * Guard that enforces role-based access control on protected routes.
 *
 * This guard checks if the authenticated user has the required roles to access
 * a route decorated with the @Roles() decorator. It supports hierarchical
 * permissions where system admins and SUPER_ADMIN users have unrestricted access.
 * Routes without role requirements are allowed through.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Creates an instance of RolesGuard.
   * @param reflector - NestJS reflector for reading metadata from handlers and classes
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Checks if the authenticated user has the required roles for the route.
   *
   * This method reads role requirements from the @Roles() decorator and compares
   * them against the user's assigned roles. System admins and SUPER_ADMIN users
   * are automatically granted access. Routes without role requirements are allowed.
   *
   * @param context - The execution context containing request details
   * @returns true if the user has required roles, throws ForbiddenException otherwise
   * @throws {ForbiddenException} When user is not authenticated or lacks required roles
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      string[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    interface Principal {
      isSystemAdmin?: boolean;
      roles?: string[];
    }

    const req = context.switchToHttp().getRequest<{
      principal?: Principal;
      user?: Principal;
    }>();
    const principal = req?.principal ?? req?.user;

    if (!principal) throw new ForbiddenException('Not authenticated');

    // Allow if user is system admin or has SUPER_ADMIN role
    if (principal.isSystemAdmin) return true;

    const roles: string[] = Array.isArray(principal.roles)
      ? principal.roles
      : [];

    // SUPER_ADMIN has all permissions
    if (roles.includes('SUPER_ADMIN')) return true;

    const allowed = requiredRoles.some((r) => roles.includes(r));

    if (!allowed) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
