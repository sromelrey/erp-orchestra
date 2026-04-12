"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetStockAdjustmentsQuery,
  useCreateStockAdjustmentMutation,
  useUpdateStockAdjustmentMutation,
  useDeleteStockAdjustmentMutation,
  useApproveStockAdjustmentMutation,
  useCancelStockAdjustmentMutation,
  useGetItemsQuery,
  useGetWarehousesQuery,
  useGetLocationsQuery,
} from "@/store/api";
import {
  StockAdjustment,
  StockAdjustmentFilters,
  CreateStockAdjustmentRequest,
  UpdateStockAdjustmentRequest,
} from "@/store/api/stockAdjustmentsApi";

export interface UseStockAdjustmentsOptions {
  initialParams?: StockAdjustmentFilters;
}

export function useStockAdjustments(options: UseStockAdjustmentsOptions = {}) {
  const [params, setParams] = useState<StockAdjustmentFilters>({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  // Data fetching
  const {
    data: adjustments = [],
    isLoading,
    error,
    refetch,
  } = useGetStockAdjustmentsQuery(params);

  const { data: items = [] } = useGetItemsQuery({ isActive: true, limit: 1000 });
  const { data: warehouses = [] } = useGetWarehousesQuery({ limit: 1000 });
  const selectedWarehouse = params.warehouseId;
  const { data: locations = [] } = useGetLocationsQuery(
    { warehouseId: String(selectedWarehouse || ''), limit: 1000 },
    { skip: !selectedWarehouse }
  );

  const [createAdjustment] = useCreateStockAdjustmentMutation();
  const [updateAdjustment] = useUpdateStockAdjustmentMutation();
  const [deleteAdjustment] = useDeleteStockAdjustmentMutation();
  const [approveAdjustment] = useApproveStockAdjustmentMutation();
  const [cancelAdjustment] = useCancelStockAdjustmentMutation();

  // Handlers
  const handleCreate = async (data: Partial<StockAdjustment>) => {
    try {
      if (!data.adjustmentType) {
        throw new Error("Adjustment type is required");
      }
      if (!data.warehouseId) {
        throw new Error("Warehouse is required");
      }
      if (!data.adjustmentDate) {
        throw new Error("Adjustment date is required");
      }
      if (!data.items || data.items.length === 0) {
        throw new Error("At least one item is required");
      }

      const adjustmentType = data.adjustmentType;
      const isDecrease = adjustmentType === 'DAMAGE' || adjustmentType === 'LOSS';

      const createData: CreateStockAdjustmentRequest = {
        adjustmentType: data.adjustmentType,
        warehouseId: Number(data.warehouseId),
        locationId: data.locationId ? Number(data.locationId) : undefined,
        referenceType: data.referenceType,
        referenceId: data.referenceId ? Number(data.referenceId) : undefined,
        adjustmentDate: data.adjustmentDate,
        notes: data.notes,
        items: data.items.map(item => {
          const qty = Number(item.quantityAdjusted);

          if (qty === 0) {
            throw new Error(`Item ${item.itemId}: Quantity cannot be zero`);
          }

          if (isDecrease && qty > 0) {
            throw new Error(`Item ${item.itemId}: ${adjustmentType} adjustment requires negative quantity (e.g., -5)`);
          }

          if (!isDecrease && qty < 0) {
            throw new Error(`Item ${item.itemId}: ${adjustmentType} adjustment requires positive quantity (e.g., 10)`);
          }

          const unitCost = item.unitCost ? Number(item.unitCost) : undefined;

          return {
            itemId: Number(item.itemId),
            quantityAdjusted: qty,
            unitCost,
            totalCost: item.totalCost ? Number(item.totalCost) : (unitCost ? qty * unitCost : undefined),
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            notes: item.notes,
          };
        }),
      };

      await createAdjustment(createData).unwrap();
      toast.success("Stock adjustment created successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create stock adjustment");
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Partial<StockAdjustment>) => {
    try {
      const updateData: UpdateStockAdjustmentRequest = {};

      const adjustmentType = data.adjustmentType;
      const isDecrease = adjustmentType === 'DAMAGE' || adjustmentType === 'LOSS';

      if (data.adjustmentType) updateData.adjustmentType = data.adjustmentType;
      if (data.warehouseId) updateData.warehouseId = Number(data.warehouseId);
      if (data.locationId !== undefined) updateData.locationId = data.locationId ? Number(data.locationId) : undefined;
      if (data.referenceType !== undefined) updateData.referenceType = data.referenceType;
      if (data.referenceId !== undefined) updateData.referenceId = data.referenceId ? Number(data.referenceId) : undefined;
      if (data.adjustmentDate) updateData.adjustmentDate = data.adjustmentDate;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.items) {
        updateData.items = data.items.map(item => {
          const qty = Number(item.quantityAdjusted);

          if (qty === 0) {
            throw new Error(`Item ${item.itemId}: Quantity cannot be zero`);
          }

          if (isDecrease && qty > 0) {
            throw new Error(`Item ${item.itemId}: ${adjustmentType} adjustment requires negative quantity (e.g., -5)`);
          }

          if (!isDecrease && qty < 0) {
            throw new Error(`Item ${item.itemId}: ${adjustmentType} adjustment requires positive quantity (e.g., 10)`);
          }

          const unitCost = item.unitCost ? Number(item.unitCost) : undefined;

          return {
            itemId: Number(item.itemId),
            quantityAdjusted: qty,
            unitCost,
            totalCost: item.totalCost ? Number(item.totalCost) : (unitCost ? qty * unitCost : undefined),
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            notes: item.notes,
          };
        });
      }

      await updateAdjustment({ id, data: updateData }).unwrap();
      toast.success("Stock adjustment updated successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update stock adjustment");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdjustment(id).unwrap();
      toast.success("Stock adjustment deleted successfully");
      refetch();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete stock adjustment");
      return false;
    }
  };

  const handleApprove = async (id: string | number): Promise<boolean> => {
    try {
      await approveAdjustment({ id: Number(id) }).unwrap();
      toast.success("Stock adjustment approved successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to approve stock adjustment");
      return false;
    }
  };

  const handleCancel = async (id: string | number): Promise<boolean> => {
    try {
      await cancelAdjustment(Number(id)).unwrap();
      toast.success("Stock adjustment cancelled successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to cancel stock adjustment");
      return false;
    }
  };

  // Check if a row is editable (only DRAFT status)
  const isRowEditable = (item: StockAdjustment) => {
    return item.status === 'DRAFT';
  };

  // Check if a row is deletable (only DRAFT status)
  const isRowDeletable = (item: StockAdjustment) => {
    return item.status === 'DRAFT';
  };

  return {
    // Data
    data: adjustments,
    items,
    warehouses,
    locations,
    
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
    handleApprove,
    handleCancel,
    refetch,
    
    // Permissions
    isRowEditable,
    isRowDeletable,
  };
}
