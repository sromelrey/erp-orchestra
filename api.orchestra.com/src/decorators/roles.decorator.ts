import { SetMetadata } from '@nestjs/common';

/** Metadata key used to store role requirements on handlers and classes */
export const ROLES_KEY = 'roles';

/**
 * Decorator that sets role-based access requirements for controllers or methods.
 *
 * Use this decorator to specify which user roles are required to access
 * a controller method or entire controller. The RolesGuard will enforce
 * these requirements by checking if the authenticated user has at least
 * one of the specified roles.
 *
 * @param roles - Array of role names that are allowed to access the decorated resource
 * @returns Decorator function that sets metadata on the target
 *
 * @example
 * ```typescript
 * // Require ADMIN or USER role for this method
 * @Roles('ADMIN', 'USER')
 * @Get('protected')
 * getProtectedData() {
 *   return 'This requires ADMIN or USER role';
 * }
 *
 * // Require ADMIN role for entire controller
 * @Roles('ADMIN')
 * @Controller('admin')
 * export class AdminController {
 *   // All methods in this controller require ADMIN role
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
