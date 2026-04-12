"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetGoodsIssuancesQuery,
  useCreateGoodsIssuanceMutation,
  useUpdateGoodsIssuanceMutation,
  useDeleteGoodsIssuanceMutation,
  useApproveGoodsIssuanceMutation,
  useCancelGoodsIssuanceMutation,
  useGetItemsQuery,
  useGetWarehousesQuery,
  useGetLocationsQuery,
  useGetItemUomsQuery,
  useGetDepartmentsQuery,
} from "@/store/api";
import {
  GoodsIssuance,
  GoodsIssuanceFilters,
  CreateGoodsIssuanceRequest,
  UpdateGoodsIssuanceRequest,
} from "@/store/api/goodsIssuanceApi";

export interface UseGoodsIssuanceOptions {
  initialParams?: GoodsIssuanceFilters;
}

export function useGoodsIssuance(options: UseGoodsIssuanceOptions = {}) {
  const [params, setParams] = useState<GoodsIssuanceFilters>({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  // Data fetching
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetGoodsIssuancesQuery(params);
  const issuances = response?.data || [];

  const { data: items = [] } = useGetItemsQuery({ isActive: true, limit: 1000 });
  const { data: warehouses = [] } = useGetWarehousesQuery({ limit: 1000 });
  const selectedWarehouse = params.warehouseId;
  const { data: locations = [] } = useGetLocationsQuery(
    { warehouseId: String(selectedWarehouse || ''), limit: 1000 },
    { skip: !selectedWarehouse }
  );
  const { data: uoms = [] } = useGetItemUomsQuery();
  const { data: deptResponse } = useGetDepartmentsQuery({});
  const departments = deptResponse?.data || [];

  // Mutations
  const [createIssuance, { isLoading: isCreating }] = useCreateGoodsIssuanceMutation();
  const [updateIssuance, { isLoading: isUpdating }] = useUpdateGoodsIssuanceMutation();
  const [deleteIssuance, { isLoading: isDeleting }] = useDeleteGoodsIssuanceMutation();
  const [approveIssuance] = useApproveGoodsIssuanceMutation();
  const [cancelIssuance] = useCancelGoodsIssuanceMutation();

  // Handlers
  const handleCreate = async (data: Partial<GoodsIssuance>) => {
    try {
      if (!data.issuanceType) {
        throw new Error("Issuance type is required");
      }
      if (!data.warehouseId) {
        throw new Error("Warehouse is required");
      }
      if (!data.issuanceDate) {
        throw new Error("Issuance date is required");
      }
      if (!data.items || data.items.length === 0) {
        throw new Error("At least one item is required");
      }

      const createData: CreateGoodsIssuanceRequest = {
        issuanceType: data.issuanceType,
        referenceType: data.referenceType,
        referenceCode: data.referenceCode,
        issuedToDepartmentId: data.issuedToDepartmentId,
        warehouseId: data.warehouseId,
        locationId: data.locationId,
        issuanceDate: data.issuanceDate,
        expectedDate: data.expectedDate,
        notes: data.notes,
        items: data.items.map(item => ({
          itemId: Number(item.itemId),
          uomId: Number(item.uomId),
          quantityIssued: Number(item.quantityIssued),
          unitPrice: item.unitPrice ? Number(item.unitPrice) : undefined,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : undefined,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate,
          notes: item.notes,
        })),
      };

      await createIssuance(createData).unwrap();
      toast.success("Goods issuance created successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create goods issuance");
      return false;
    }
  };

  const handleUpdate = async (id: string | number, data: Partial<GoodsIssuance>) => {
    try {
      const updateData: UpdateGoodsIssuanceRequest = {};
      
      if (data.issuanceType) updateData.issuanceType = data.issuanceType;
      if (data.referenceType !== undefined) updateData.referenceType = data.referenceType;
      if (data.referenceCode !== undefined) updateData.referenceCode = data.referenceCode;
      if (data.issuedToDepartmentId !== undefined) updateData.issuedToDepartmentId = data.issuedToDepartmentId;
      if (data.warehouseId) updateData.warehouseId = data.warehouseId;
      if (data.locationId !== undefined) updateData.locationId = data.locationId;
      if (data.issuanceDate) updateData.issuanceDate = data.issuanceDate;
      if (data.expectedDate !== undefined) updateData.expectedDate = data.expectedDate;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.items) {
        updateData.items = data.items.map(item => ({
          itemId: Number(item.itemId),
          uomId: Number(item.uomId),
          quantityIssued: Number(item.quantityIssued),
          unitPrice: item.unitPrice ? Number(item.unitPrice) : undefined,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : undefined,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate,
          notes: item.notes,
        }));
      }

      await updateIssuance({ id: Number(id), body: updateData }).unwrap();
      toast.success("Goods issuance updated successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update goods issuance");
      return false;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteIssuance(Number(id)).unwrap();
      toast.success("Goods issuance deleted successfully");
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete goods issuance");
    }
  };

  const handleApprove = async (id: string | number, notes?: string) => {
    try {
      await approveIssuance({ id: Number(id), body: { notes } }).unwrap();
      toast.success("Goods issuance approved successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to approve goods issuance");
      return false;
    }
  };

  const handleCancel = async (id: string | number) => {
    try {
      await cancelIssuance(Number(id)).unwrap();
      toast.success("Goods issuance cancelled successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to cancel goods issuance");
      return false;
    }
  };

  // Check if a row is editable (only DRAFT status)
  const isRowEditable = (item: GoodsIssuance) => {
    return item.status === 'DRAFT';
  };

  // Check if a row is deletable (only DRAFT status)
  const isRowDeletable = (item: GoodsIssuance) => {
    return item.status === 'DRAFT';
  };

  return {
    // Data
    data: issuances,
    items,
    warehouses,
    locations,
    uoms,
    departments,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,

    // Params
    params,
    setParams,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleCancel,
    refetch,

    // Permissions
    isRowEditable,
    isRowDeletable,
  };
}
