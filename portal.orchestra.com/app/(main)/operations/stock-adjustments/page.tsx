"use client";

import { useMemo, useCallback } from "react";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { EntityManager } from "@/components/entity-manager";
import { StockAdjustmentHeader } from "@/components/stock-adjustments/StockAdjustmentHeader";
import { columns } from "./column";
import { getFormFields, FormFieldsContext } from "./form-fields";
import { useStockAdjustments } from "@/hooks/operations/useStockAdjustments";
import { useStockAdjustmentWorkflow } from "@/hooks/operations/useStockAdjustmentWorkflow";
import { useStockAdjustmentForm } from "@/hooks/operations/useStockAdjustmentForm";
import { StockAdjustment } from "@/store/api/stockAdjustmentsApi";

export default function StockAdjustmentsPage() {
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
  } = useStockAdjustments();

  const { getLocationsByWarehouse } = useStockAdjustmentForm();

  const {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen: handleWorkflowFormOpen,
    handleCloseForm: handleWorkflowFormClose,
  } = useStockAdjustmentWorkflow({
    handleApprove,
    handleCancel,
    stockAdjustments: data as unknown as Record<string, unknown>[],
    refetch,
  });

  // Merge data with optimistic updates
  const dataWithOptimistic = useMemo(() => {
    return mergeWithOptimistic(data as unknown as Record<string, unknown>[]);
  }, [data, mergeWithOptimistic]);

  // Form handlers
  const handleFormOpen = useCallback((item: StockAdjustment) => {
    const mergedItem = mergeWithOptimistic([item as unknown as Record<string, unknown>])[0];
    handleWorkflowFormOpen(mergedItem);
  }, [mergeWithOptimistic, handleWorkflowFormOpen]);

  const handleFormClose = useCallback(() => {
    if (isProcessing) return false;
    handleWorkflowFormClose();
    return true;
  }, [isProcessing, handleWorkflowFormClose]);

  // Check if a row is editable (only DRAFT)
  const isRowEditable = useCallback((item: StockAdjustment) => {
    return item?.status === 'DRAFT';
  }, []);

  // Check if a row is deletable (only DRAFT)
  const isRowDeletable = useCallback((item: StockAdjustment) => {
    return item?.status === 'DRAFT';
  }, []);

  // Get form fields with context
  const formFields = useMemo(() => {
    const context: FormFieldsContext = {
      getLocationsByWarehouse,
      warehouseOptions: (warehouses || []).map(wh => ({
        value: String(wh.id),
        label: `${wh.code} - ${wh.name}`,
      })),
      locationOptions: [],
      itemOptions: (items || []).map(item => ({
        value: String(item.id),
        label: `${item.code} - ${item.name}`,
      })),
      isProcessing,
    };
    return getFormFields(context);
  }, [warehouses, items, isProcessing, getLocationsByWarehouse]);

  return (
    <PermissionGuard permission="inventory.adjustment.read">
      <div className="p-6">
        <EntityManager<StockAdjustment>
          title="Stock Adjustments"
          subtitle="Manage stock adjustments for damage, loss, found items, and stock counts"
          columns={columns}
          data={dataWithOptimistic as unknown as StockAdjustment[]}
          isLoading={isLoading}
          error={error ? (typeof error === 'string' ? error : 'Failed to fetch stock adjustments') : null}
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
          header={StockAdjustmentHeader}
          formWidth="50%"
          keyExtractor={(item) => item.id}
          entityName="Stock Adjustment"
          permissions={{
            create: "inventory.adjustment.create",
            update: "inventory.adjustment.edit",
            delete: "inventory.adjustment.delete",
          }}
        />
      </div>
    </PermissionGuard>
  );
}
