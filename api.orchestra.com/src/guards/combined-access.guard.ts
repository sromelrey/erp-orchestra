import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  REQUIRE_ACCESS_KEY,
  RequireAccessMetadata,
} from '@/decorators/require-access.decorator';
import { TenantsService } from '@/modules/system/tenants/tenants.service';
import { PermissionService } from '@/modules/system/permissions/permission.service';
import { User } from '@/entities/system/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Guard that enforces both tenant feature access and user permission checks.
 *
 * This guard implements double-gating security:
 * 1. Verifies the tenant's plan includes the required feature (module)
 * 2. Verifies the user has the required permission
 *
 * Both checks must pass for access to be granted.
 */
@Injectable()
export class CombinedAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantsService: TenantsService,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<RequireAccessMetadata>(
      REQUIRE_ACCESS_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      // No metadata means no restriction
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const { feature, permission } = metadata;

    // Check 1: Tenant Feature Access
    if (user.tenantId) {
      const tenantFeatures = await this.tenantsService.getTenantFeatures(
        user.tenantId,
      );

      if (!tenantFeatures.includes(feature)) {
        throw new ForbiddenException(
          `Tenant does not have access to feature: ${feature}`,
        );
      }
    }

    // Check 2: User Permission
    const hasPermission = await this.permissionService.checkPermission(
      user.id,
      permission,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `User does not have permission: ${permission}`,
      );
    }

    return true;
  }
}
