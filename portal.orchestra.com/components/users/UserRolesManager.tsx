'use client';

import { useState, useEffect } from 'react';
import { User } from '@/store/api/usersApi';
import { useGetRolesQuery, useAssignUsersMutation, useRemoveUserFromRoleMutation } from '@/store/api/rolesApi';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface UserRolesManagerProps {
  user: User;
  onClose?: () => void;
}

export function UserRolesManager({ user, onClose }: UserRolesManagerProps) {
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
  const [assignUsers] = useAssignUsersMutation();
  const [removeUserFromRole] = useRemoveUserFromRoleMutation();
  
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize selected roles from user
  useEffect(() => {
    if (user.userRoles) {
      const roleIds = user.userRoles
        .map((ur) => ur.role?.id)
        .filter((id): id is number => id !== undefined);
      setSelectedRoleIds(roleIds);
    }
  }, [user]);

  const handleToggle = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const currentRoleIds = user.userRoles?.map((ur) => ur.role?.id).filter((id): id is number => id !== undefined) || [];
      
      // Roles to add
      const rolesToAdd = selectedRoleIds.filter((id) => !currentRoleIds.includes(id));
      
      // Roles to remove
      const rolesToRemove = currentRoleIds.filter((id) => !selectedRoleIds.includes(id));

      // Assign new roles
      for (const roleId of rolesToAdd) {
        await assignUsers({
          roleId,
          userIds: [user.id],
        }).unwrap();
      }

      // Remove old roles
      for (const roleId of rolesToRemove) {
        await removeUserFromRole({
          roleId,
          userId: user.id,
        }).unwrap();
      }

      toast.success('User roles updated successfully');
      onClose?.();
    } catch (error) {
      toast.error('Failed to update user roles');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    const currentIds = user.userRoles?.map((ur) => ur.role?.id).filter((id): id is number => id !== undefined) || [];
    if (currentIds.length !== selectedRoleIds.length) return true;
    return !currentIds.every((id) => selectedRoleIds.includes(id));
  };

  if (isLoadingRoles) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Assign Roles</h4>
        {roles.map((role) => (
          <div key={role.id} className="flex items-start space-x-2">
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoleIds.includes(role.id)}
              onCheckedChange={() => handleToggle(role.id)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={`role-${role.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {role.name}
              </Label>
              {role.description && (
                <p className="text-xs text-muted-foreground">
                  {role.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!hasChanges() || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Roles
        </Button>
      </div>
    </div>
  );
}
