'use client';

import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import {
  selectUserPermissions,
  selectIsAuthenticated,
  selectIsInitialized,
  selectCurrentUser,
} from '@/store/slices/authSlice';
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
  children,
  fallback = null,
  redirectTo,
}: HasPermissionProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const userPermissions = useSelector(selectUserPermissions);
  const user = useSelector(selectCurrentUser);

  // Wait for the AuthInit /auth/me call to complete before evaluating permissions.
  // Without this, full-page refreshes instantly fail because Redux starts empty.
  if (!isInitialized) {
    return null; // Or a subtle loading spinner if preferred
  }

  // System admins bypass all permission checks (matches backend PermissionsGuard)
  if (user?.isSystemAdmin) {
    return <>{children}</>;
  }

  // TODO: Add selectTenantFeatures to authSlice once plan/modules are synchronized from backend
  // For now, we focus on permission gating as the primary shield
  const hasFeatureAccess = true; // Placeholder for future feature-gating logic

  const hasPermissionAccess = permission ? userPermissions.includes(permission) : true;

  const hasAccess = isAuthenticated && hasFeatureAccess && hasPermissionAccess;

  if (!hasAccess) {
    // If they don't have access because they aren't logged in at all, always go to login
    if (!isAuthenticated) {
      router.push('/login');
      return null;
    }

    // If they are logged in but lack the specific permission, go to the specified redirect path
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }

    return <>{fallback}</>;
  }

  return <>{children}</>;
}
