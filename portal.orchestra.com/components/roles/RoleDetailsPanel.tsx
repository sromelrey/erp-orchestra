'use client';

import { useGetPermissionsQuery } from "@/store/api/rolesApi";
import { Role } from '@/types';
import { PermissionManager } from "@/components/roles/permission-manager";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck } from 'lucide-react';

interface RoleDetailsPanelProps {
  role: Role;
  onClose?: () => void | undefined;
}

export function RoleDetailsPanel({ role, onClose }: RoleDetailsPanelProps) {
  const { data: allPermissions = [], isLoading: isLoadingPermissions } = useGetPermissionsQuery();
  
  if (isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Role Header - Removed (now handled in PermissionManager) */}


      {/* Permission Manager - Scrollable */}
      {!role.isSystemRole && (
        <div className="flex-1 overflow-hidden">
          <PermissionManager 
            role={role} 
            allPermissions={allPermissions}
            onClose={onClose} 
          />
        </div>
      )}


      {/* System Role Permissions - Scrollable */}
      {role.isSystemRole && (
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="bg-muted/40 border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">
                System Permissions (Read-only)
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.rolePermissions?.map((rp) => {
                const action = rp.permission.action.toLowerCase();
                const badgeClass =
                  action === "create"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : action === "update" || action === "edit"
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : action === "delete" || action === "remove"
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : action === "manage" || action === "admin"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-sky-100 text-sky-700 border-sky-200";
                const label = `${rp.permission.action.charAt(0).toUpperCase() + rp.permission.action.slice(1)} ${rp.permission.resource.charAt(0).toUpperCase() + rp.permission.resource.slice(1)}`;
                return (
                  <Badge
                    key={rp.permission.id}
                    variant="outline"
                    className={`text-xs font-medium border ${badgeClass}`}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
