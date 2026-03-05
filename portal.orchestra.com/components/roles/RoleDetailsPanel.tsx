'use client';

import { useState, useEffect } from 'react';
import { Role, Permission, useGetPermissionsQuery, useAssignPermissionsMutation } from '@/store/api/rolesApi';
import { PermissionPicker } from './PermissionPicker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

interface RoleDetailsPanelProps {
  role: Role;
  onClose?: () => void;
}

export function RoleDetailsPanel({ role, onClose }: RoleDetailsPanelProps) {
  const { data: permissions = [], isLoading: isLoadingPermissions } = useGetPermissionsQuery();
  const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();
  
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  // Initialize selected permissions from role
  useEffect(() => {
    if (role.rolePermissions) {
      const ids = role.rolePermissions.map((rp) => rp.permission.id);
      setSelectedPermissionIds(ids);
    }
  }, [role]);

  const handleSave = async () => {
    try {
      await assignPermissions({
        roleId: role.id,
        permissionIds: selectedPermissionIds,
      }).unwrap();
      toast.success('Permissions updated successfully');
      onClose?.();
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const hasChanges = () => {
    const currentIds = role.rolePermissions?.map((rp) => rp.permission.id) || [];
    if (currentIds.length !== selectedPermissionIds.length) return true;
    return !currentIds.every((id) => selectedPermissionIds.includes(id));
  };

  if (isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{role.name}</h3>
        <p className="text-sm text-muted-foreground">{role.description}</p>
        {role.isSystemRole && (
          <p className="text-xs text-amber-600 mt-1">
            System role - permissions are managed by the system
          </p>
        )}
      </div>

      {!role.isSystemRole && (
        <>
          <PermissionPicker
            permissions={permissions}
            selectedPermissionIds={selectedPermissionIds}
            onChange={setSelectedPermissionIds}
          />

          <div className="flex justify-end gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges() || isAssigning}
            >
              {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Permissions
            </Button>
          </div>
        </>
      )}

      {role.isSystemRole && (
      <div className="bg-muted/40 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">System Permissions (Read-only)</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {role.rolePermissions?.map((rp) => {
              const action = rp.permission.action.toLowerCase();
              const badgeClass =
                action === 'create' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                action === 'update' || action === 'edit' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                action === 'delete' || action === 'remove' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                action === 'manage' || action === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                'bg-sky-100 text-sky-700 border-sky-200';
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
      )}
    </div>
  );
}
