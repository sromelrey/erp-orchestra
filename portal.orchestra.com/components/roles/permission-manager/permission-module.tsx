'use client';

import * as React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PermissionRow } from './permission-row';
import { PermissionModuleProps } from './types';

/**
 * PermissionModule - Module section in the permission matrix
 *
 * Features:
 * - Module header with icon and resource count
 * - Collapsible section for better organization
 * - Search filtering for resources
 * - Clean visual separation between modules
 *
 * @param module - The module name (e.g., 'system', 'hris')
 * @param resources - Array of resources with their permissions
 * @param selectedPermissions - Set of currently selected permission slugs
 * @param onTogglePermission - Callback to toggle a permission
 * @param searchQuery - Current search query for filtering
 */
export function PermissionModule({
  module,
  resources,
  selectedPermissions,
  onTogglePermission,
  searchQuery,
}: PermissionModuleProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Calculate filtered resources first (before any early returns)
  const filteredResources = React.useMemo(() => {
    if (!searchQuery) return resources;
    return resources.filter((resource) =>
      resource.resource.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resources, searchQuery]);

  // Calculate enabled count
  const enabledCount = React.useMemo(() => {
    return filteredResources.reduce((count, resource) => {
      const enabledInResource = resource.permissions.filter((p) =>
        selectedPermissions.has(p.slug)
      ).length;
      return count + enabledInResource;
    }, 0);
  }, [filteredResources, selectedPermissions]);

  // Early return after all hooks are called
  if (filteredResources.length === 0) return null;

  const totalPossible = filteredResources.length * 5; // 5 actions per resource

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <div
        className={cn(
          'flex items-center justify-between p-3 rounded-lg border bg-muted/30',
          'cursor-pointer hover:bg-muted/50 transition-colors'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
          <div>
            <h3 className="font-semibold capitalize text-sm">{module}</h3>
            <p className="text-xs text-muted-foreground">
              {filteredResources.length} resources • {enabledCount}/{totalPossible} permissions
              enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress indicator */}
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${totalPossible > 0 ? (enabledCount / totalPossible) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Expand/collapse icon */}
          <div
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-200',
              isExpanded && 'rotate-90'
            )}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Permission Rows */}
      {isExpanded && (
        <div className="space-y-2 pl-4">
          {filteredResources.map((resource) => (
            <PermissionRow
              key={resource.resource}
              module={module}
              resource={resource}
              selectedPermissions={selectedPermissions}
              onTogglePermission={onTogglePermission}
            />
          ))}
        </div>
      )}
    </div>
  );
}
