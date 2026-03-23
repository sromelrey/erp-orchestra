'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * PermissionToggle - Individual toggle button for permission actions
 *
 * Features:
 * - Color-coded toggles for different action types
 * - Smooth animations and transitions
 * - Accessible button with proper focus states
 * - Visual feedback for enabled/disabled states
 *
 * @param enabled - Whether the permission is currently enabled
 * @param onChange - Callback when toggle is clicked
 * @param action - The action type (view, create, update, delete, manage)
 */
export interface PermissionToggleProps {
  enabled: boolean;
  onChange: () => void;
  action: 'view' | 'create' | 'update' | 'delete' | 'manage';
}

export function PermissionToggle({ enabled, onChange, action }: PermissionToggleProps) {
  const getActionColors = (action: string, enabled: boolean) => {
    if (!enabled) {
      return 'bg-muted border-border';
    }

    switch (action) {
      case 'view':
        return 'bg-sky-500 border-sky-600 hover:bg-sky-600';
      case 'create':
        return 'bg-emerald-500 border-emerald-600 hover:bg-emerald-600';
      case 'update':
        return 'bg-amber-500 border-amber-600 hover:bg-amber-600';
      case 'delete':
        return 'bg-rose-500 border-rose-600 hover:bg-rose-600';
      case 'manage':
        return 'bg-purple-500 border-purple-600 hover:bg-purple-600';
      default:
        return 'bg-primary border-primary hover:bg-primary/90';
    }
  };

  return (
    <button
      onClick={onChange}
      className={cn(
        'w-12 h-6 rounded-full border-2 transition-all duration-200',
        'relative flex items-center shrink-0',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        getActionColors(action, enabled)
      )}
      aria-pressed={enabled}
      aria-label={`Toggle ${action} permission`}
    >
      <div
        className={cn(
          'w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}
