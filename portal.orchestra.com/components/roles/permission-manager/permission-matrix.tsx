'use client';

import * as React from 'react';
import { PermissionModule } from './permission-module';
import { PermissionMatrixProps } from './types';

const ACTION_TYPES = ['view', 'create', 'update', 'delete', 'manage'] as const;

/**
 * PermissionMatrix - Main matrix component for permission management
 *
 * Features:
 * - Grid layout with action type headers
 * - Sticky header for easy reference while scrolling
 * - Module-based organization
 * - Search filtering integration
 * - Clean, modern SaaS-style design
 *
 * @param groupedPermissions - Permissions grouped by module and resource
 * @param selectedPermissions - Set of currently selected permission slugs
 * @param onTogglePermission - Callback to toggle a permission
 * @param searchQuery - Current search query for filtering
 */
export function PermissionMatrix({
  groupedPermissions,
  selectedPermissions,
  onTogglePermission,
  searchQuery,
}: PermissionMatrixProps) {
  const hasResults = React.useMemo(() => {
    if (!searchQuery) return true;

    return Object.values(groupedPermissions).some((resources) =>
      resources.some((resource) =>
        resource.resource.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [groupedPermissions, searchQuery]);

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No permissions found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search terms to find the permissions you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Matrix Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b mb-6 pb-4 z-10">
        <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground">
          <div className="font-semibold">Resource</div>
          {ACTION_TYPES.map((action) => (
            <div key={action} className="text-center capitalize">
              {action}
            </div>
          ))}
        </div>
      </div>

      {/* Permission Modules */}
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([module, resources]) => (
          <PermissionModule
            key={module}
            module={module}
            resources={resources}
            selectedPermissions={selectedPermissions}
            onTogglePermission={onTogglePermission}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {Object.keys(groupedPermissions).length} modules with{' '}
            {Object.values(groupedPermissions).reduce(
              (total, resources) => total + resources.length,
              0
            )}{' '}
            resources
          </div>
          <div>{selectedPermissions.size} permissions currently enabled</div>
        </div>
      </div>
    </div>
  );
}
