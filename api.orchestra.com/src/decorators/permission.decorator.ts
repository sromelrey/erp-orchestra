import { SetMetadata } from '@nestjs/common';

/** Metadata key used to store permission requirements on handlers and classes */
export const PERMISSION_KEY = 'permission';

/**
 * Interface for permission requirements.
 */
export interface PermissionRequirement {
  /** Menu ID or menu code to check permissions on */
  menuIdOrCode: number | string;
  /** Action type required (e.g., 'read', 'create', 'update', 'delete') */
  action: string;
}

/**
 * Decorator that sets permission-based access requirements for controllers or methods.
 *
 * Use this decorator to specify which menu/resource permissions are required to access
 * a controller method or entire controller. The PermissionGuard will enforce these
 * requirements by checking if the authenticated user has the specified permission.
 *
 * @param menuIdOrCode - ID or code of the menu/resource required
 * @param action - The action permission required (e.g., 'read', 'create')
 * @returns Decorator function that sets metadata on the target
 *
 * @example
 * ```typescript
 * // Require 'read' permission on menu ID 5
 * @RequirePermission(5, 'read')
 * @Get('users')
 * findAllUsers() {
 *   return this.usersService.findAll();
 * }
 *
 * // Require 'create' permission on menu with code 'user-management'
 * @RequirePermission('user-management', 'create')
 * @Post('users')
 * createUser(@Body() createUserDto: CreateUserDto) {
 *   return this.usersService.create(createUserDto);
 * }
 * ```
 */
export const RequirePermission = (
  menuIdOrCode: number | string,
  action: string,
) => SetMetadata(PERMISSION_KEY, { menuIdOrCode, action });
