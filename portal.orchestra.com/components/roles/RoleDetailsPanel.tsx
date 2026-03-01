'use client';

import { useState, useEffect } from 'react';
import { Role, Permission, useGetPermissionsQuery, useAssignPermissionsMutation } from '@/store/api/rolesApi';
import { PermissionPicker } from './PermissionPicker';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Current Permissions</h4>
          <div className="space-y-1">
            {role.rolePermissions?.map((rp) => (
              <div key={rp.permission.id} className="text-sm">
                {rp.permission.module}.{rp.permission.resource}.{rp.permission.action}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
