'use client';

import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectUserPermissions, selectIsAuthenticated } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

interface HasPermissionProps {
  /**
   * The permission slug to check (e.g., 'hris.employee.create').
   * If omitted, it only checks for feature/authentication.
   */
  permission?: string;

  /**
   * The feature/module code to check (e.g., 'HRIS', 'OPS').
   * This is part of the "Double-Gating" strategy.
   */
  feature?: string;

  /**
   * What to render if the user HAS access.
   */
  children: ReactNode;

  /**
   * Optional UI to show if access is DENIED.
   * Defaults to null (hides the component).
   */
  fallback?: ReactNode;

  /**
   * If true, will redirect the user to this path if access is denied.
   * Useful for route-level protection.
   */
  redirectTo?: string;
}

/**
 * A granular UI gating component that implements the "Double-Gated" security standard.
 * It checks both the User's permissions and (optionally) the Tenant's active features.
 */
export function HasPermission({
  permission,
  feature,
  children,
  fallback = null,
  redirectTo,
}: HasPermissionProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userPermissions = useSelector(selectUserPermissions);
  
  // TODO: Add selectTenantFeatures to authSlice once plan/modules are synchronized from backend
  // For now, we focus on permission gating as the primary shield
  const hasFeatureAccess = true; // Placeholder for future feature-gating logic

  const hasPermissionAccess = permission 
    ? userPermissions.includes(permission) 
    : true;

  const hasAccess = isAuthenticated && hasFeatureAccess && hasPermissionAccess;

  if (!hasAccess) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
