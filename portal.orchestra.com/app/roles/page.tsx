'use client';

import { EntityManager } from "@/components/entity-manager";
import { columns } from "./column";
import { roleFormFields } from "./form-fields";
import { Shield } from "lucide-react";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/store/api/rolesApi";
import { toast } from "sonner";

export default function RolesPage() {
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const stats = [
    {
      label: "Total Roles",
      value: roles.length,
      icon: Shield,
      color: "bg-purple-500/10 text-purple-600",
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
      await updateRole({ id: String(id), ...formData }).unwrap();
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteRole(String(id)).unwrap();
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
      throw error;
    }
  };

  return (
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
  );
}
