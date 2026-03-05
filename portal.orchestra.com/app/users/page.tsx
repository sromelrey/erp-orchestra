'use client';

import { useState, useMemo } from 'react';
import { EntityManager } from "@/components/entity-manager";
import { columns as baseColumns } from "./column";
import { userFormFields } from "./form-fields";
import { Users as UsersIcon, UserCog } from "lucide-react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  User,
} from "@/store/api/usersApi";
import { toast } from "sonner";
import { UserRolesManager } from "@/components/users/UserRolesManager";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/ui/data-table";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { HasPermission } from "@/components/auth/HasPermission";

export default function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  // Derive the selected user from the live RTK Query cache.
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: UsersIcon,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Users",
      value: users.filter((u: any) => u.isActive).length,
      icon: UsersIcon,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  const handleCreate = async (formData: any) => {
    try {
      await createUser(formData).unwrap();
      toast.success("User created successfully");
    } catch (error) {
      toast.error("Failed to create user");
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      await updateUser({ id: String(id), ...formData }).unwrap();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteUser(Number(id)).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      throw error;
    }
  };

  const handleManageRoles = (user: User) => {
    setSelectedUserId(user.id);
    setIsRoleDialogOpen(true);
  };

  // Add Manage Roles column
  const columns: Column<any>[] = useMemo(() => {
    return [
      ...baseColumns,
      {
        header: "Manage",
        className: "text-center",
        cell: (item: User) => (
          <HasPermission permission="system.user.manage">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleManageRoles(item)}
            >
              <UserCog className="h-4 w-4" />
              Roles
            </Button>
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
        formFields={userFormFields}
        keyExtractor={(item) => item.id}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        stats={stats}
        searchPlaceholder="Search users..."
        isLoading={isLoading}
        permissions={{
          create: "system.user.manage",
          update: "system.user.manage",
          delete: "system.user.manage",
          view: "system.user.view",
        }}
      />

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserRolesManager
              user={selectedUser}
              onClose={() => setIsRoleDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PermissionGuard>
  );
}
