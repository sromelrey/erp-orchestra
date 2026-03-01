'use client';

import { useState, useMemo } from 'react';
import { EntityManager } from "@/components/entity-manager";
import { columns as baseColumns } from "./column";
import { roleFormFields } from "./form-fields";
import { Shield, Settings } from "lucide-react";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  Role,
} from "@/store/api/rolesApi";
import { toast } from "sonner";
import { RoleDetailsPanel } from "@/components/roles/RoleDetailsPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/ui/data-table";

export default function RolesPage() {
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

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

  const handleCreate = async (formData: any) => {
    try {
      await createRole(formData).unwrap();
      toast.success("Role created successfully");
    } catch (error) {
      toast.error("Failed to create role");
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      const role = roles.find((r) => r.id === String(id));
      if (role?.isSystemRole) {
        toast.error("Cannot modify system roles");
        throw new Error("Cannot modify system roles");
      }
      await updateRole({ id: String(id), ...formData }).unwrap();
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const role = roles.find((r) => r.id === String(id));
      if (role?.isSystemRole) {
        toast.error("Cannot delete system roles");
        throw new Error("Cannot delete system roles");
      }
      await deleteRole(String(id)).unwrap();
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
      throw error;
    }
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionDialogOpen(true);
  };

  // Add Manage Permissions column
  const columns: Column<any>[] = useMemo(() => {
    return [
      ...baseColumns,
      {
        header: "Manage",
        className: "text-center",
        cell: (item: Role) => (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleManagePermissions(item)}
          >
            <Settings className="h-4 w-4" />
            Permissions
          </Button>
        ),
      },
    ];
  }, []);

  return (
    <>
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
      />

      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Role Permissions</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <RoleDetailsPanel
              role={selectedRole}
              onClose={() => setIsPermissionDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
