"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetLocationsQuery,
  useGetLocationTreeQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useGetWarehousesQuery,
} from "@/store/api";
import { CreateLocationRequest, LocationsQueryParams } from "@/types/operations";

export function useLocations(warehouseId?: string) {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(warehouseId);

  // Data fetching
  const {
    data: locations = [],
    isLoading: isLoadingLocations,
    error: locationsError,
  } = useGetLocationsQuery(
    {
      warehouseId: selectedWarehouseId || '',
      search,
      isActive,
    } as LocationsQueryParams,
    { skip: !selectedWarehouseId }
  );

  const {
    data: locationTree = [],
    isLoading: isLoadingTree,
    error: treeError,
  } = useGetLocationTreeQuery(selectedWarehouseId || '', { skip: !selectedWarehouseId });

  // Get warehouses for selection
  const { data: warehouses = [] } = useGetWarehousesQuery({ limit: 1000 });

  // Mutations
  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();

  // Handlers
  const handleCreate = async (formData: CreateLocationRequest) => {
    try {
      if (!selectedWarehouseId) {
        throw new Error('Warehouse ID is required for creating location');
      }
      await createLocation({
        warehouseId: selectedWarehouseId,
        ...formData,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      }).unwrap();
      toast.success("Location created successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create location");
      return false;
    }
  };

  const handleUpdate = async (id: string, formData: CreateLocationRequest) => {
    try {
      if (!selectedWarehouseId) {
        throw new Error('Warehouse ID is required for updating location');
      }
      await updateLocation({
        id,
        warehouseId: selectedWarehouseId,
        body: formData,
      }).unwrap();
      toast.success("Location updated successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update location");
      return false;
    }
  };

  return {
    locations,
    locationTree,
    isLoading: isLoadingLocations || isLoadingTree,
    error: locationsError || treeError,
    search,
    setSearch,
    isActive,
    setIsActive,
    selectedWarehouseId,
    setSelectedWarehouseId,
    handleCreate,
    handleUpdate,
    warehouses,
  };
}
