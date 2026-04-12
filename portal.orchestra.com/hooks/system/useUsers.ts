"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignUserPermissionsMutation,
  useRemoveUserPermissionsMutation,
  useGetRolesQuery,
} from "@/store/api";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types";

export interface UseUsersOptions {
  initialParams?: Record<string, unknown>;
}

export function useUsers(options: UseUsersOptions = {}) {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  // Data fetching
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery();

  const { data: roles = [] } = useGetRolesQuery();

  // Mutations
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [assignPermissions] = useAssignUserPermissionsMutation();
  const [removePermissions] = useRemoveUserPermissionsMutation();

  // Handlers
  const handleCreate = async (data: Partial<User>) => {
    try {
      if (!data.email) {
        throw new Error("Email is required");
      }
      if (!data.firstName) {
        throw new Error("First name is required");
      }
      if (!data.lastName) {
        throw new Error("Last name is required");
      }
      if (!data.roleIds || data.roleIds.length === 0) {
        throw new Error("At least one role is required");
      }

      const createData: CreateUserRequest = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: "password123",
        status: data.status || "ACTIVE",
        isTenantAdmin: data.isTenantAdmin || false,
      };

      await createUser(createData).unwrap();
      toast.success("User created successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err.data?.message || err.message || "Failed to create user");
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Partial<User>) => {
    try {
      const updateData: UpdateUserRequest = {
        id,
      };

      if (data.email) updateData.email = data.email;
      if (data.firstName) updateData.firstName = data.firstName;
      if (data.lastName) updateData.lastName = data.lastName;
      if (data.status) updateData.status = data.status;
      if (data.isTenantAdmin !== undefined) updateData.isTenantAdmin = data.isTenantAdmin;

      await updateUser(updateData).unwrap();
      toast.success("User updated successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err.data?.message || err.message || "Failed to update user");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err.data?.message || err.message || "Failed to delete user");
      return false;
    }
  };

  const handleAssignPermissions = async (
    userId: number,
    permissionIds: number[],
    type: "GRANT" | "DENY" = "GRANT",
    expiresAt?: string
  ) => {
    try {
      await assignPermissions({
        userId,
        permissionIds,
        type,
        expiresAt,
      }).unwrap();
      toast.success("Permissions assigned successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err.data?.message || err.message || "Failed to assign permissions");
      return false;
    }
  };

  const handleRemovePermissions = async (userId: number, permissionIds: number[]) => {
    try {
      await removePermissions({
        userId,
        permissionIds,
      }).unwrap();
      toast.success("Permissions removed successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err.data?.message || err.message || "Failed to remove permissions");
      return false;
    }
  };

  // Check if a row is editable (not BANNED)
  const isRowEditable = (item: User) => {
    return item.status !== "BANNED";
  };

  // Check if a row is deletable (not BANNED)
  const isRowDeletable = (item: User) => {
    return item.status !== "BANNED";
  };

  return {
    // Data
    data: users,
    roles,

    // Loading states
    isLoading,
    error,

    // Params
    params,
    setParams,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAssignPermissions,
    handleRemovePermissions,
    refetch,

    // Permissions
    isRowEditable,
    isRowDeletable,
  };
}
