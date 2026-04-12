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
    error,
    params,
    setParams,
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

  // Form handlers
  const handleFormOpen = useCallback((item: StockTransfer) => {
    const mergedItem = mergeWithOptimistic([item as unknown as Record<string, unknown>])[0];
    handleWorkflowFormOpen(mergedItem);
  }, [mergeWithOptimistic, handleWorkflowFormOpen]);

  const handleFormClose = useCallback(() => {
    if (isProcessing) return false;
    handleWorkflowFormClose();
    return true;
  }, [isProcessing, handleWorkflowFormClose]);

  const isRowEditable = useCallback((item: StockTransfer) => {
    return item?.status === 'PENDING';
  }, []);

  const isRowDeletable = useCallback((item: StockTransfer) => {
    return item?.status === 'PENDING';
  }, []);

  // Derive currentStatus from optimistic data for form locking
  const currentStatus = useMemo(() => {
    if (!optimisticUpdates || Object.keys(optimisticUpdates).length === 0) return undefined;
    const keys = Object.keys(optimisticUpdates);
    if (keys.length === 0) return undefined;
    const latest = optimisticUpdates[keys[keys.length - 1]] as Record<string, unknown>;
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
        <EntityManager<StockTransfer>
          title="Stock Transfers"
          subtitle="Manage stock transfers between warehouses"
          columns={columns}
          data={dataWithOptimistic as unknown as StockTransfer[]}
          isLoading={isLoading}
          error={error ? (typeof error === 'string' ? error : 'Failed to fetch stock transfers') : null}
          params={params}
          setParams={setParams}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
          formFields={formFields}
          workflowActions={workflowActions}
          isProcessing={isProcessing}
          optimisticUpdates={optimisticUpdates}
          header={StockTransferHeader}
          formWidth="50%"
          keyExtractor={(item) => item.id}
          entityName="Stock Transfer"
          permissions={{
            create: "inventory.transfer.create",
            update: "inventory.transfer.edit",
            delete: "inventory.transfer.delete",
          }}
        />
      </div>
    </PermissionGuard>
  );
}
