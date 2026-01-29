import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/decorators/require-permissions.decorator';
import { PermissionService } from '@/modules/system/permissions/permission.service';

/**
 * Guard that enforces slug-based permission access control on protected routes.
 *
 * This guard checks if the authenticated user has the required permissions to access
 * a route decorated with the @RequirePermissions() decorator. It uses the
 * PermissionService.checkPermission() method to verify access.
 *
 * @example
 * ```typescript
 * @Controller('employees')
 * @UseGuards(AuthenticatedGuard, PermissionsGuard)
 * export class EmployeeController {
 *   @Get()
 *   @RequirePermissions('hris.employee.view')
 *   findAll() { }
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  /**
   * Checks if the authenticated user has all required permissions for the route.
   *
   * @param context - The execution context containing request details
   * @returns Promise resolving to true if the user has all required permissions
   * @throws {ForbiddenException} When user lacks required permissions
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { id: number; isSystemAdmin?: boolean };
      principal?: { id: number; isSystemAdmin?: boolean };
    }>();
    const user = request.user ?? request.principal;

    // If no authenticated user, deny access
    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    // System admins bypass permission checks
    if (user.isSystemAdmin) {
      return true;
    }

    // Check each required permission
    for (const permission of requiredPermissions) {
      const hasPermission = await this.permissionService.checkPermission(
        user.id,
        permission,
      );

      if (!hasPermission) {
        throw new ForbiddenException(`Insufficient permission: ${permission}`);
      }
    }

    return true;
  }
}
