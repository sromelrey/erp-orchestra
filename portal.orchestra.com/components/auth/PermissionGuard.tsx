'use client';

import React, { ReactNode } from 'react';
import { HasPermission } from './HasPermission';

interface PermissionGuardProps {
  /**
   * The permission slug required to access this route/section.
   */
  permission?: string;

  /**
   * The feature code required to access this route/section.
   */
  feature?: string;

  /**
   * The content to protect.
   */
  children: ReactNode;

  /**
   * Path to redirect to if unauthorized.
   * Defaults to '/unauthorized'.
   */
  redirectTo?: string;
}

/**
 * A layout-level guard component that protects entire pages or sections.
 * Redirects to /unauthorized by default if access is denied.
 */
export function PermissionGuard({
  permission,
  feature,
  children,
  redirectTo = '/system/unauthorized',
}: PermissionGuardProps) {
  return (
    <HasPermission permission={permission} feature={feature} redirectTo={redirectTo}>
      {children}
    </HasPermission>
  );
}
