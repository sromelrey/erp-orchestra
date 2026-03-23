'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PermissionToggle } from './permission-toggle';
import { PermissionRowProps } from './types';

/**
 * PermissionRow - Single row in the permission matrix
 *
 * Features:
 * - Displays resource name and action toggles
 * - Hover states for better interactivity
 * - Clean grid layout with consistent spacing
 * - Responsive design with proper alignment
 *
 * @param module - The module name (e.g., 'system', 'hris')
 * @param resource - The resource object with permissions
 * @param selectedPermissions - Set of currently selected permission slugs
 * @param onTogglePermission - Callback to toggle a permission
 */
export function PermissionRow({
  module,
  resource,
  selectedPermissions,
  onTogglePermission,
}: PermissionRowProps) {
  const actions: Array<'view' | 'create' | 'update' | 'delete' | 'manage'> = [
    'view',
    'create',
    'update',
    'delete',
    'manage',
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-6 gap-4 items-center p-3 rounded-lg border',
        'hover:bg-muted/50 transition-colors duration-200',
        'group'
      )}
    >
      {/* Resource Name */}
      <div className="font-medium text-sm group-hover:text-primary transition-colors">
        {resource.resource}
      </div>

      {/* Permission Toggles */}
      {actions.map((action) => {
        // Find the actual permission for this action from the resource data
        const permission = resource.permissions.find(
          (p) =>
            p.action.toLowerCase() === action ||
            (action === 'update' && p.action.toLowerCase() === 'edit')
        );

        const isEnabled = permission ? selectedPermissions.has(permission.slug) : false;

        return (
          <div key={action} className="flex justify-center">
            <PermissionToggle
              enabled={isEnabled}
              onChange={() => permission && onTogglePermission(permission.slug)}
              action={action}
            />
          </div>
        );
      })}
    </div>
  );
}
