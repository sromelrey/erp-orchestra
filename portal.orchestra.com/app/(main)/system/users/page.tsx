'use client';

import { useState, useMemo } from 'react';
import { EntityManager } from '@/components/entity-manager';
import { columns as baseColumns } from './column';
import { userFormFields } from './form-fields';
import { Users as UsersIcon, UserCog, Shield } from 'lucide-react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/store/api';
import { useGetRolesQuery } from '@/store/api/rolesApi';
import { toast } from 'sonner';
import { UserRolesManager } from '@/components/users/UserRolesManager';
import { UserPermissionManager } from '@/components/users/UserPermissionManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Column } from '@/components/ui/data-table';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { HasPermission } from '@/components/auth/HasPermission';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types';
import { FormField } from '@/components/entity-manager/types';

export default function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: number | null }>({ open: false, userId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Prepare role options for form (filter out System Admin)
  const roleOptions = useMemo(() => {
    return roles
      .filter((role: { code: string }) => role.code !== 'SYSTEM_ADMIN')
      .map((role: { id: number; name: string }) => ({
        value: role.id.toString(),
        label: role.name,
      }));
  }, [roles]);

  // Dynamic form fields with role options
  const formFields = useMemo(() => {
    return userFormFields.map((field: FormField) => {
      if (field.name === 'roleIds') {
        return { ...field, options: roleOptions };
      }
      return field;
    });
  }, [roleOptions]);

  // Derive the selected user from the live RTK Query cache.
  const selectedUser = useMemo(
    () => users.find((u: User) => u.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: UsersIcon,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active Users',
      value: users.filter((u: User) => u.status === 'ACTIVE').length,
      icon: UsersIcon,
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  const handleCreate = async (formData: Partial<User>) => {
    try {
      const createData: CreateUserRequest = {
        ...(formData as unknown as CreateUserRequest),
      };
      // Ensure roleIds is included and is an array
      if ('roleIds' in formData && formData.roleIds) {
        createData.roleIds = Array.isArray(formData.roleIds)
          ? (formData.roleIds as number[])
          : [formData.roleIds as number];
      }
      await createUser(createData).unwrap();
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<User>) => {
    try {
      const updateData: Partial<UpdateUserRequest> = {
        id: Number(id),
        ...(formData as unknown as Partial<UpdateUserRequest>),
      };
      // Ensure roleIds is included and is an array
      if ('roleIds' in formData && formData.roleIds) {
        updateData.roleIds = Array.isArray(formData.roleIds)
          ? (formData.roleIds as number[])
          : [formData.roleIds as number];
      }
      await updateUser(updateData as UpdateUserRequest).unwrap();
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    const user = users.find((u: User) => u.id === Number(id));
    if (user) {
      setDeleteConfirm({ open: true, userId: Number(id) });
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm.userId) {
      setIsDeleting(true);
      try {
        await deleteUser(deleteConfirm.userId).unwrap();
        toast.success('User deleted successfully');
        setDeleteConfirm({ open: false, userId: null });
      } catch (error) {
        toast.error('Failed to delete user');
        throw error;
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleManageRoles = (user: User) => {
    setSelectedUserId(user.id);
    setIsRoleDialogOpen(true);
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUserId(user.id);
    setIsPermissionDialogOpen(true);
  };

  // Add Manage Roles and Permissions columns
  const columns: Column<User>[] = useMemo(() => {
    return [
      ...baseColumns,
      {
        header: 'Manage',
        className: 'text-center',
        cell: (item: User) => (
          <HasPermission permission="system.user.manage">
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleManageRoles(item)}
              >
                <UserCog className="h-4 w-4" />
                Roles
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleManagePermissions(item)}
              >
                <Shield className="h-4 w-4" />
                Permissions
              </Button>
            </div>
          </HasPermission>
        ),
      },
    ];
  }, []);

  return (
    <PermissionGuard permission="system.user.view">
      <EntityManager
        entityName="User"
        entityNamePlural="Users"
        data={users}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        formWidth='50%'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        stats={stats}
        searchPlaceholder="Search users..."
        isLoading={isLoading}
        permissions={{
          create: 'system.user.manage',
          update: 'system.user.manage',
          delete: 'system.user.manage',
          view: 'system.user.view',
        }}
      />

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserRolesManager
              key={selectedUser.id}
              user={selectedUser}
              onClose={() => setIsRoleDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage User Permissions</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserPermissionManager
              key={selectedUser.id}
              user={selectedUser}
              onClose={() => setIsPermissionDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => !isDeleting && setDeleteConfirm({ open, userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, userId: null })} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PermissionGuard>
  );
}
