'use client';

import { useState, useMemo } from 'react';
import { User, UserPermission } from '@/types';
import { useGetPermissionsQuery } from '@/store/api/rolesApi';
import {
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,
  useRemoveUserPermissionsMutation,
} from '@/store/api';
import { PermissionManager } from '@/components/roles/permission-manager';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Shield, ShieldX } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserPermissionManagerProps {
  user: User;
  onClose?: () => void;
}

type PermissionType = 'GRANT' | 'DENY';

export function UserPermissionManager({ user, onClose }: UserPermissionManagerProps) {
  const { data: allPermissions = [], isLoading: isLoadingAllPermissions } =
    useGetPermissionsQuery();
  const { data: userPermissions = [], isLoading: isLoadingUserPermissions } =
    useGetUserPermissionsQuery(user.id);
  const [assignPermissions, { isLoading: isAssigning }] = useAssignUserPermissionsMutation();
  const [removePermissions, { isLoading: isRemoving }] = useRemoveUserPermissionsMutation();

  const [permissionType, setPermissionType] = useState<PermissionType>('GRANT');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // Derive initial selected slugs based on the current permission type (GRANT/DENY)
  const initialSelectedSlugs = useMemo(() => {
    return userPermissions
      .filter((up: UserPermission) => up.type === permissionType)
      .map((up: UserPermission) => up.permission.slug);
  }, [userPermissions, permissionType]);

  const handleSave = async (selectedSlugs: string[]) => {
    try {
      const currentSlugs = userPermissions
        .filter((up: UserPermission) => up.type === permissionType)
        .map((up: UserPermission) => up.permission.slug);

      const toAdd = selectedSlugs.filter((slug: string) => !currentSlugs.includes(slug));
      const toRemove = currentSlugs.filter((slug: string) => !selectedSlugs.includes(slug));

      // Add new permissions
      if (toAdd.length > 0) {
        const permissionIds = toAdd
          .map((slug) => allPermissions.find((p) => p.slug === slug)?.id)
          .filter((id): id is number => id !== undefined);

        await assignPermissions({
          userId: user.id,
          permissionIds,
          type: permissionType,
          expiresAt: expirationDate?.toISOString(),
        }).unwrap();
      }

      // Remove permissions
      if (toRemove.length > 0) {
        await removePermissions({ userId: user.id, permissions: toRemove.map((slug: string) => ({ slug })) }).unwrap();
      }

      toast.success(`User ${permissionType.toLowerCase()} permissions updated successfully`);
      onClose?.();
    } catch (error) {
      toast.error('Failed to update user permissions');
      console.error(error);
      throw error;
    }
  };

  if (isLoadingAllPermissions || isLoadingUserPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex gap-2 items-center">
          <Label>Permission Type:</Label>
          <Select
            value={permissionType}
            onValueChange={(value: PermissionType) => setPermissionType(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GRANT">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Grant
                </div>
              </SelectItem>
              <SelectItem value="DENY">
                <div className="flex items-center gap-2">
                  <ShieldX className="w-4 h-4 text-red-600" />
                  Deny
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center flex-1">
          <Label>Expiration (optional):</Label>
          <Input
            type="date"
            value={expirationDate ? expirationDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setExpirationDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-48"
          />
        </div>
      </div>

      <div className="border rounded-lg h-[600px] overflow-hidden">
        <PermissionManager
          title="User Specific Permissions"
          subtitle={`${user.firstName} ${user.lastName}`}
          description={user.email}
          allPermissions={allPermissions}
          initialSelectedPermissions={initialSelectedSlugs}
          onSave={handleSave}
          isSaving={isAssigning || isRemoving}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
