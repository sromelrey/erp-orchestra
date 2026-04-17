"use client";

import { useMemo, useCallback } from "react";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { EntityManager } from "@/components/entity-manager";
import { StockTransferHeader } from "@/components/stock-transfers/StockTransferHeader";
import { columns } from "./column";
import { getFormFields, FormFieldsContext } from "./form-fields";
import { useStockTransfers } from "@/hooks/operations/useStockTransfers";
import { useStockTransferWorkflow } from "@/hooks/operations/useStockTransferWorkflow";
import { useStockTransferForm } from "@/hooks/operations/useStockTransferForm";
import { StockTransfer } from "@/store/api/stockTransfersApi";

export default function StockTransfersPage() {
  const {
    data,
    items,
    warehouses,
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleCancel,
    refetch,
  } = useStockTransfers();

  const { getLocationsByWarehouse } = useStockTransferForm();

  const {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen: handleWorkflowFormOpen,
    handleCloseForm: handleWorkflowFormClose,
  } = useStockTransferWorkflow({
    handleApprove,
    handleCancel,
    stockTransfers: data as unknown as Record<string, unknown>[],
    refetch,
  });

  // Merge data with optimistic updates
  const dataWithOptimistic = useMemo(() => {
    return mergeWithOptimistic(data as unknown as Record<string, unknown>[]);
  }, [data, mergeWithOptimistic]);

  const handleCreateStockTransfer = async (formData: Partial<StockTransfer>) => {
    await handleCreate(formData);
  };

  const handleUpdateStockTransfer = async (id: string | number, formData: Partial<StockTransfer>) => {
    await handleUpdate(Number(id), formData);
  };

  const handleDeleteStockTransfer = async (id: string | number) => {
    await handleDelete(Number(id));
  };

  // Form handlers
  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    const mergedItem = mergeWithOptimistic([item])[0];
    handleWorkflowFormOpen(mergedItem);
  }, [mergeWithOptimistic, handleWorkflowFormOpen]);

  const handleFormClose = useCallback(() => {
    if (isProcessing) return false;
    handleWorkflowFormClose();
    return true;
  }, [isProcessing, handleWorkflowFormClose]);

  const isRowEditable = useCallback((item: Record<string, unknown>) => {
    return (item as unknown as StockTransfer)?.status === 'PENDING';
  }, []);

  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    return (item as unknown as StockTransfer)?.status === 'PENDING';
  }, []);

  // Derive currentStatus from optimistic data for form locking
  const currentStatus = useMemo(() => {
    if (!optimisticUpdates || optimisticUpdates.size === 0) return undefined;
    const values = Array.from(optimisticUpdates.values());
    if (values.length === 0) return undefined;
    const latest = values[values.length - 1] as Record<string, unknown>;
    return latest?.status as string | undefined;
  }, [optimisticUpdates]);

  const formFields = useMemo(() => {
    const context: FormFieldsContext = {
      getLocationsByWarehouse,
      warehouseOptions: (warehouses || []).map(wh => ({
        value: String(wh.id),
        label: `${wh.code} - ${wh.name}`,
      })),
      itemOptions: (items || []).map(item => ({
        value: String(item.id),
        label: `${item.code} - ${item.name}`,
      })),
      isProcessing,
      currentStatus,
    };
    return getFormFields(context);
  }, [warehouses, items, isProcessing, getLocationsByWarehouse, currentStatus]);

  return (
    <PermissionGuard permission="inventory.transfer.read">
      <div className="p-6">
        <EntityManager
          entityName="Stock Transfer"
          entityNamePlural="Stock Transfers"
          data={dataWithOptimistic}
          columns={columns as unknown as import('@/components/ui/data-table').Column<Record<string, unknown>>[]}
          formWidth="50%"
          formFields={formFields}
          keyExtractor={(item) => (item as { id: string | number }).id}
          onCreate={handleCreateStockTransfer}
          onUpdate={handleUpdateStockTransfer}
          onDelete={handleDeleteStockTransfer}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          searchPlaceholder="Search stock transfers by reference..."
          isLoading={isLoading}
          isProcessing={isProcessing}
          permissions={{
            create: "inventory.transfer.create",
            update: "inventory.transfer.edit",
            delete: "inventory.transfer.delete",
            view: "inventory.transfer.read",
          }}
          workflowActions={workflowActions}
          optimisticUpdates={optimisticUpdates}
          header={StockTransferHeader}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
        />
      </div>
    </PermissionGuard>
  );
}
