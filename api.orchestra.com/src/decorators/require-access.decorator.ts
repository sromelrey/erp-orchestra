import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ACCESS_KEY = 'requireAccess';

export interface RequireAccessMetadata {
  feature: string;
  permission: string;
}

/**
 * Decorator to enforce both feature access and permission checks.
 *
 * @param metadata - Object containing feature code and permission slug
 * @example
 * ```typescript
 * @RequireAccess({ feature: 'HRIS', permission: 'hris.employee.view' })
 * async getEmployees() { ... }
 * ```
 */
export const RequireAccess = (metadata: RequireAccessMetadata) =>
  SetMetadata(REQUIRE_ACCESS_KEY, metadata);
