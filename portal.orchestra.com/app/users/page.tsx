'use client';

import { EntityManager } from "@/components/entity-manager";
import { columns } from "./column";
import { userFormFields } from "./form-fields";
import { Users as UsersIcon } from "lucide-react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/api/usersApi";
import { toast } from "sonner";

export default function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

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
      await deleteUser(String(id)).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      throw error;
    }
  };

  return (
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
    />
  );
}
