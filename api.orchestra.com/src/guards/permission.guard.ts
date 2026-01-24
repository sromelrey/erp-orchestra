import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@/decorators/permission.decorator';
import { PermissionService } from '@/modules/system/permissions/permission.service';

/**
 * Guard that enforces permission-based access control on protected routes.
 *
 * This guard checks if the authenticated user has the required permissions to access
 * a route decorated with the @RequirePermission() decorator. It supports both
 * menu ID-based and menu code-based permission checks, with system admins having
 * unrestricted access.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  /**
   * Creates an instance of PermissionGuard.
   * @param reflector - NestJS reflector for reading metadata from handlers and classes
   * @param permissionService - Service for checking permissions
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  /**
   * Checks if the authenticated user has the required permissions for the route.
   *
   * This method reads permission requirements from the @RequirePermission() decorator
   * and checks if the user has the specified permission on the target menu/resource.
   * System admins are automatically granted access, and routes without permission
   * requirements are allowed.
   *
   * @param context - The execution context containing request details
   * @returns Promise resolving to true if the user has required permissions
   * @throws {ForbiddenException} When user lacks required permissions
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      | {
          menuIdOrCode: number | string;
          action: string;
        }
      | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    // If no permission requirement, allow access
    if (!requiredPermission) {
      return true;
    }

    const { menuIdOrCode, action } = requiredPermission;
    const request = context.switchToHttp().getRequest<{
      user?: { id: number };
      principal?: { id: number };
    }>();
    const principal = request.user ?? request.principal;

    // If no authenticated user, deny access
    if (!principal) {
      throw new ForbiddenException('Not authenticated');
    }

    // Check if the user has the required permission
    const hasPermission = await this.permissionService.hasPermission(
      principal.id,
      menuIdOrCode,
      action,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permission: ${action} on resource ${menuIdOrCode}`,
      );
    }

    return true;
  }
}
