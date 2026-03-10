import { Permission, Role } from "@/types";

export interface PermissionManagerProps {
  role: Role;
  allPermissions: Permission[];
  onClose?: () => void;
}

export interface PermissionFilters {
  searchQuery: string;
  actionTypes: string[];
  resources: string[];
}

export interface PermissionModule {
  name: string;
  permissions: Permission[];
  selectedCount: number;
  totalCount: number;
}

export interface PermissionContentProps {
  role: Role;
  selectedModule: string | null;
  onModuleSelect: (module: string) => void;
  isFullscreen: boolean;
}

export interface PermissionSidebarProps {
  modules: Record<string, PermissionModule>;
  selectedModule: string | null;
  onModuleSelect: (module: string) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

// New matrix component interfaces
export interface PermissionMatrixProps {
  groupedPermissions: Record<
    string,
    Array<{
      resource: string;
      permissions: Permission[];
    }>
  >;
  selectedPermissions: Set<string>;
  onTogglePermission: (slug: string) => void;
  searchQuery: string;
}

export interface PermissionModuleProps {
  module: string;
  resources: Array<{
    resource: string;
    permissions: Permission[];
  }>;
  selectedPermissions: Set<string>;
  onTogglePermission: (slug: string) => void;
  searchQuery: string;
}

export interface PermissionRowProps {
  module: string;
  resource: {
    resource: string;
    permissions: Permission[];
  };
  selectedPermissions: Set<string>;
  onTogglePermission: (slug: string) => void;
}

export interface PermissionToggleProps {
  enabled: boolean;
  onChange: () => void;
  action: "view" | "create" | "update" | "delete" | "manage";
}

// Re-export Role type for convenience
export type { Role } from "@/types";
