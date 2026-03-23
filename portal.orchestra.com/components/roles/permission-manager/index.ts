// Main permission management components
export { PermissionManager } from './permission-manager';
export { PermissionSidebar } from './permission-sidebar';
export { PermissionContent } from './permission-content';

// New matrix components
export { PermissionMatrix } from './permission-matrix';
export { PermissionModule } from './permission-module';
export { PermissionRow } from './permission-row';
export { PermissionToggle } from './permission-toggle';

// Types
export type {
  PermissionManagerProps,
  PermissionFilters,
  PermissionModule as PermissionModuleType,
  PermissionContentProps,
  PermissionSidebarProps,
  PermissionMatrixProps,
  PermissionModuleProps,
  PermissionRowProps,
  PermissionToggleProps,
} from './types';

// Hooks
export { usePermissionManager } from './hooks/use-permission-manager';
export { usePermissionFilters } from './hooks/use-permission-filters';
export { usePermissionSelection } from './hooks/use-permission-selection';
export { usePermissionMatrix } from './hooks/use-permission-matrix';
