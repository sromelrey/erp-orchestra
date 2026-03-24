"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} from "@/store/api";
import { CreateWarehouseRequest } from "@/types/operations";
import { formFields } from "@/app/(main)/operations/warehouses/form-fields";

export function useWarehouses() {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Data fetching
  const {
    data: warehouses = [],
    isLoading,
    error,
  } = useGetWarehousesQuery({
    search,
    isActive,
  });

  // Mutations
  const [createWarehouse] = useCreateWarehouseMutation();
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const [deleteWarehouse] = useDeleteWarehouseMutation();

  // Handlers
  const handleCreate = async (formData: CreateWarehouseRequest) => {
    try {
      await createWarehouse({
        ...formData,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      }).unwrap();
      toast.success("Warehouse created successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create warehouse");
      return false;
    }
  };

  const handleUpdate = async (id: string, formData: CreateWarehouseRequest) => {
    try {
      await updateWarehouse({
        id,
        body: formData,
      }).unwrap();
      toast.success("Warehouse updated successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update warehouse");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWarehouse(id).unwrap();
      toast.success("Warehouse deleted successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete warehouse");
      return false;
    }
  };

  return {
    warehouses,
    isLoading,
    error,
    search,
    setSearch,
    isActive,
    setIsActive,
    handleCreate,
    handleUpdate,
    handleDelete,
    formFields,
  };
}
