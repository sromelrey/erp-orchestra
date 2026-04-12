"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetStockTransfersQuery,
  useCreateStockTransferMutation,
  useUpdateStockTransferMutation,
  useDeleteStockTransferMutation,
  useApproveStockTransferMutation,
  useCancelStockTransferMutation,
  useGetItemsQuery,
  useGetWarehousesQuery,
} from "@/store/api";
import {
  StockTransfer,
  StockTransferFilters,
  CreateStockTransferRequest,
  UpdateStockTransferRequest,
} from "@/store/api/stockTransfersApi";

export interface UseStockTransfersOptions {
  initialParams?: StockTransferFilters;
}

export function useStockTransfers(options: UseStockTransfersOptions = {}) {
  const [params, setParams] = useState<StockTransferFilters>({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  // Data fetching
  const {
    data: transfers = [],
    isLoading,
    error,
    refetch,
  } = useGetStockTransfersQuery(params);

  const { data: items = [] } = useGetItemsQuery({ isActive: true, limit: 1000 });
  const { data: warehouses = [] } = useGetWarehousesQuery({ limit: 1000 });

  // Mutations
  const [createTransfer] = useCreateStockTransferMutation();
  const [updateTransfer] = useUpdateStockTransferMutation();
  const [deleteTransfer] = useDeleteStockTransferMutation();
  const [approveTransfer] = useApproveStockTransferMutation();
  const [cancelTransfer] = useCancelStockTransferMutation();

  // Handlers
  const handleCreate = async (data: Partial<StockTransfer>) => {
    try {
      if (!data.sourceWarehouseId) {
        throw new Error("Source warehouse is required");
      }
      if (!data.destinationWarehouseId) {
        throw new Error("Destination warehouse is required");
      }
      if (!data.transferDate) {
        throw new Error("Transfer date is required");
      }
      if (!data.items || data.items.length === 0) {
        throw new Error("At least one item is required");
      }

      if (Number(data.sourceWarehouseId) === Number(data.destinationWarehouseId)) {
        throw new Error("Source and destination warehouses must be different");
      }
      if (data.sourceLocationId && data.destinationLocationId && Number(data.sourceLocationId) === Number(data.destinationLocationId)) {
        throw new Error("Source and destination locations must be different");
      }

      const createData: CreateStockTransferRequest = {
        sourceWarehouseId: Number(data.sourceWarehouseId),
        sourceLocationId: data.sourceLocationId ? Number(data.sourceLocationId) : undefined,
        destinationWarehouseId: Number(data.destinationWarehouseId),
        destinationLocationId: data.destinationLocationId ? Number(data.destinationLocationId) : undefined,
        transferDate: data.transferDate,
        expectedDate: data.expectedDate,
        notes: data.notes,
        items: data.items.map(item => {
          const qty = Number(item.quantityTransferred);
          if (qty <= 0) throw new Error(`Item ${item.itemId}: Quantity must be positive`);
          const unitCost = item.unitCost ? Number(item.unitCost) : undefined;
          return {
            itemId: Number(item.itemId),
            quantityTransferred: qty,
            unitCost,
            totalCost: item.totalCost ? Number(item.totalCost) : (unitCost ? qty * unitCost : undefined),
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            notes: item.notes,
          };
        }),
      };

      await createTransfer(createData).unwrap();
      toast.success("Stock transfer created successfully");
      setTimeout(() => refetch(), 300);
      return true;
    } catch (error: unknown) {
      console.error('Stock transfer creation error:', error);
      const err = error as { data?: { message?: string }; message?: string; status?: number };
      const errorMessage = err.data?.message || err.message || 'Failed to create stock transfer';
      toast.error(errorMessage);
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Partial<StockTransfer>) => {
    try {
      const updateData: UpdateStockTransferRequest = {};

      if (data.sourceWarehouseId && data.destinationWarehouseId && Number(data.sourceWarehouseId) === Number(data.destinationWarehouseId)) {
        throw new Error("Source and destination warehouses must be different");
      }
      if (data.sourceLocationId && data.destinationLocationId && Number(data.sourceLocationId) === Number(data.destinationLocationId)) {
        throw new Error("Source and destination locations must be different");
      }

      if (data.sourceWarehouseId) updateData.sourceWarehouseId = Number(data.sourceWarehouseId);
      if (data.sourceLocationId !== undefined) updateData.sourceLocationId = data.sourceLocationId ? Number(data.sourceLocationId) : undefined;
      if (data.destinationWarehouseId) updateData.destinationWarehouseId = Number(data.destinationWarehouseId);
      if (data.destinationLocationId !== undefined) updateData.destinationLocationId = data.destinationLocationId ? Number(data.destinationLocationId) : undefined;
      if (data.transferDate) updateData.transferDate = data.transferDate;
      if (data.expectedDate !== undefined) updateData.expectedDate = data.expectedDate;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.items) {
        updateData.items = data.items.map(item => {
          const qty = Number(item.quantityTransferred);
          if (qty <= 0) throw new Error(`Item ${item.itemId}: Quantity must be positive`);
          const unitCost = item.unitCost ? Number(item.unitCost) : undefined;
          return {
            itemId: Number(item.itemId),
            quantityTransferred: qty,
            unitCost,
            totalCost: item.totalCost ? Number(item.totalCost) : (unitCost ? qty * unitCost : undefined),
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            notes: item.notes,
          };
        });
      }

      await updateTransfer({ id, body: updateData }).unwrap();
      toast.success("Stock transfer updated successfully");
      setTimeout(() => refetch(), 300);
      return true;
    } catch (error: unknown) {
      console.error('Stock transfer update error:', error);
      const err = error as { data?: { message?: string }; message?: string; status?: number };
      const errorMessage = err.data?.message || err.message || 'Failed to update stock transfer';
      toast.error(errorMessage);
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransfer(id).unwrap();
      toast.success("Stock transfer deleted successfully");
      setTimeout(() => refetch(), 300);
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete stock transfer");
      return false;
    }
  };

  const handleApprove = async (id: string | number) => {
    try {
      await approveTransfer(Number(id)).unwrap();
      toast.success("Stock transfer approved successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to approve stock transfer");
      return false;
    }
  };

  const handleCancel = async (id: string | number) => {
    try {
      await cancelTransfer(Number(id)).unwrap();
      toast.success("Stock transfer cancelled successfully");
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to cancel stock transfer");
      return false;
    }
  };

  // Check if a row is editable (only PENDING status)
  const isRowEditable = (item: StockTransfer) => {
    return item.status === 'PENDING';
  };

  // Check if a row is deletable (only PENDING status)
  const isRowDeletable = (item: StockTransfer) => {
    return item.status === 'PENDING';
  };

  return {
    // Data
    data: transfers,
    items,
    warehouses,

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
