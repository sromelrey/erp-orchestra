'use client';

import * as React from 'react';
import { Permission, Role } from '@/types';

/**
 * Hook for managing permission matrix state and operations
 *
 * Features:
 * - Groups permissions by module and resource
 * - Manages selected permissions state
 * - Provides bulk operations (select all, clear all)
 * - Handles permission toggling
 * - Calculates permission statistics
 *
 * @param role - The role object containing rolePermissions
 */
export interface GroupedPermissions {
  [module: string]: Array<{
    resource: string;
    permissions: Permission[];
  }>;
}

export interface PermissionStats {
  total: number;
  enabled: number;
  byModule: Record<string, number>;
}

export function usePermissionMatrix(
  initialSelectedSlugs: string[] = [],
  allPermissions: Permission[] = []
) {
  // State for selected permissions
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState('');

  // Group permissions by module and resource
  const groupedPermissions = React.useMemo((): GroupedPermissions => {
    if (!allPermissions.length) return {};

    const groups: GroupedPermissions = {};

    allPermissions.forEach((permission) => {
      const { module, resource } = permission;

      if (!groups[module]) {
        groups[module] = [];
      }

      const existingResource = groups[module].find((r) => r.resource === resource);
      if (existingResource) {
        existingResource.permissions.push(permission);
      } else {
        groups[module].push({
          resource,
          permissions: [permission],
        });
      }
    });

    // Sort modules and resources alphabetically
    const sortedGroups: GroupedPermissions = {};
    Object.keys(groups)
      .sort()
      .forEach((module) => {
        sortedGroups[module] = groups[module].sort((a, b) => a.resource.localeCompare(b.resource));
      });

    return sortedGroups;
  }, [allPermissions]);

  // Initialize selected permissions from initial slugs
  React.useEffect(() => {
    if (initialSelectedSlugs) {
      setSelectedPermissions(new Set(initialSelectedSlugs));
    }
  }, [initialSelectedSlugs]);

  // Calculate permission statistics
  const permissionStats = React.useMemo((): PermissionStats => {
    const total = allPermissions.length;
    const enabled = selectedPermissions.size;

    const byModule: Record<string, number> = {};
    Object.entries(groupedPermissions).forEach(([module, resources]) => {
      byModule[module] = resources.reduce((count, resource) => {
        const modulePermissions = resource.permissions.map((p) => p.slug);
        return count + modulePermissions.filter((slug) => selectedPermissions.has(slug)).length;
      }, 0);
    });

    return { total, enabled, byModule };
  }, [allPermissions, groupedPermissions, selectedPermissions]);

  // Toggle individual permission
  const handleTogglePermission = React.useCallback((permissionSlug: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionSlug)) {
        newSet.delete(permissionSlug);
      } else {
        newSet.add(permissionSlug);
      }
      return newSet;
    });
  }, []);

  // Bulk select all permissions
  const handleBulkSelect = React.useCallback(() => {
    const allPermissionSlugs = allPermissions.map((p) => p.slug);
    setSelectedPermissions(new Set(allPermissionSlugs));
  }, [allPermissions]);

  // Bulk clear all permissions
  const handleBulkClear = React.useCallback(() => {
    setSelectedPermissions(new Set());
  }, []);

  // Bulk select permissions for a specific module
  const handleBulkSelectModule = React.useCallback(
    (module: string) => {
      const modulePermissions =
        groupedPermissions[module]?.flatMap((resource) =>
          resource.permissions.map((permission) => permission.slug)
        ) || [];

      setSelectedPermissions((prev) => {
        const newSet = new Set(prev);
        modulePermissions.forEach((slug) => newSet.add(slug));
        return newSet;
      });
    },
    [groupedPermissions]
  );

  // Bulk clear permissions for a specific module
  const handleBulkClearModule = React.useCallback(
    (module: string) => {
      const modulePermissions =
        groupedPermissions[module]?.flatMap((resource) =>
          resource.permissions.map((permission) => permission.slug)
        ) || [];

      setSelectedPermissions((prev) => {
        const newSet = new Set(prev);
        modulePermissions.forEach((slug) => newSet.delete(slug));
        return newSet;
      });
    },
    [groupedPermissions]
  );

  return {
    // State
    groupedPermissions,
    selectedPermissions,
    searchQuery,
    setSearchQuery,

    // Statistics
    permissionStats,

    // Actions
    handleTogglePermission,
    handleBulkSelect,
    handleBulkClear,
    handleBulkSelectModule,
    handleBulkClearModule,
  };
}
