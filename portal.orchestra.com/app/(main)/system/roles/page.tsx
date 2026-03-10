'use client';

import { useState, useMemo } from 'react';
import { EntityManager } from "@/components/entity-manager";
import { columns as baseColumns } from "./column";
import { roleFormFields } from "./form-fields";
import { Shield, Settings, Users } from "lucide-react";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/store/api/rolesApi";
import { toast } from "sonner";
import { RoleDetailsPanel } from "@/components/roles/RoleDetailsPanel";
import { AssignUsersPanel } from "@/components/roles/AssignUsersPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/ui/data-table";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { HasPermission } from "@/components/auth/HasPermission";
import { Role } from "@/types";

export default function RolesPage() {
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isAssignUsersDialogOpen, setIsAssignUsersDialogOpen] = useState(false);

  // Derive the selected role from the live RTK Query cache.
  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? null,
    [roles, selectedRoleId]
  );

  const stats = [
    {
      label: "Total Roles",
      value: roles.length,
      icon: Shield,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Custom Roles",
      value: roles.filter((r) => !r.isSystemRole).length,
      icon: Shield,
      color: "bg-blue-500/10 text-blue-600",
    },
  ];

  const handleCreate = async (formData: Partial<Role>) => {
    try {
      await createRole(formData as Omit<Role, "id">).unwrap();
      toast.success("Role created successfully");
    } catch (error) {
      toast.error("Failed to create role");
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<Role>) => {
    try {
      const role = roles.find((r) => r.id === Number(id));
      if (role?.isSystemRole) {
        toast.error("Cannot modify system roles");
        throw new Error("Cannot modify system roles");
      }
      await updateRole({ id: Number(id), ...formData }).unwrap();
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const role = roles.find((r) => r.id === Number(id));
      if (role?.isSystemRole) {
        toast.error("Cannot delete system roles");
        throw new Error("Cannot delete system roles");
      }
      await deleteRole(Number(id)).unwrap();
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
      throw error;
    }
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRoleId(role.id);
    setIsPermissionDialogOpen(true);
  };

  const handleAssignUsers = (role: Role) => {
    setSelectedRoleId(role.id);
    setIsAssignUsersDialogOpen(true);
  };

  // Add Manage Permissions column
  const columns: Column<Role>[] = useMemo(() => {
    return [
      ...baseColumns,
      {
        header: "Manage",
        className: "text-center",
        cell: (item: Role) => (
          <HasPermission permission="system.role.manage">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleManagePermissions(item)}
              >
                <Settings className="h-4 w-4" />
                Permissions
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleAssignUsers(item)}
              >
                <Users className="h-4 w-4" />
                Users
              </Button>
            </div>
          </HasPermission>
        ),
      },
    ];
  }, []);

  return (
    <PermissionGuard permission="system.role.view">
      <EntityManager
        entityName="Role"
        entityNamePlural="Roles"
        data={roles}
        columns={columns}
        formFields={roleFormFields}
        keyExtractor={(item) => item.id}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        stats={stats}
        searchPlaceholder="Search roles..."
        isLoading={isLoading}
        permissions={{
          create: "system.role.manage",
          update: "system.role.manage",
          delete: "system.role.manage",
          view: "system.role.view",
        }}
      />

      <Dialog
        open={isPermissionDialogOpen}
        onOpenChange={setIsPermissionDialogOpen}
      >
        <DialogContent className="min-w-[80vw] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Manage Role Permissions</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="h-[calc(90vh-8rem)] overflow-hidden">
              <RoleDetailsPanel
                key={selectedRole.id}
                role={selectedRole}
                onClose={() => setIsPermissionDialogOpen(false)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAssignUsersDialogOpen}
        onOpenChange={setIsAssignUsersDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Users to Role</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <AssignUsersPanel
              key={selectedRole.id}
              role={selectedRole}
              onClose={() => setIsAssignUsersDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PermissionGuard>
  );
}
