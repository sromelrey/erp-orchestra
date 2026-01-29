import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to store permission requirements on handlers and classes.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator that sets slug-based permission requirements for controllers or methods.
 *
 * Use this decorator to specify which permissions are required to access
 * a controller method or entire controller. The PermissionsGuard will enforce
 * these requirements by checking if the authenticated user has the specified permissions.
 *
 * @param permissions - One or more permission slugs required (e.g., 'hris.employee.view')
 * @returns Decorator function that sets metadata on the target
 *
 * @example
 * ```typescript
 * // Require single permission
 * @RequirePermissions('hris.employee.view')
 * @Get()
 * findAll() {
 *   return this.employeeService.findAll();
 * }
 *
 * // Require multiple permissions (user must have ALL)
 * @RequirePermissions('hris.employee.create', 'hris.employee.update')
 * @Post()
 * create(@Body() dto: CreateEmployeeDto) {
 *   return this.employeeService.create(dto);
 * }
 * ```
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
