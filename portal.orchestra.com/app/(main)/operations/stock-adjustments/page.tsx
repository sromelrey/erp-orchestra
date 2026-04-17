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

  const handleCreateStockAdjustment = async (formData: Partial<StockAdjustment>) => {
    await handleCreate(formData);
  };

  const handleUpdateStockAdjustment = async (id: string | number, formData: Partial<StockAdjustment>) => {
    await handleUpdate(id, formData);
  };

  const handleDeleteStockAdjustment = async (id: string | number) => {
    await handleDelete(id);
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

  // Check if a row is editable (only DRAFT)
  const isRowEditable = useCallback((item: Record<string, unknown>) => {
    return (item as unknown as StockAdjustment)?.status === 'DRAFT';
  }, []);

  // Check if a row is deletable (only DRAFT)
  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    return (item as unknown as StockAdjustment)?.status === 'DRAFT';
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
        <EntityManager
          entityName="Stock Adjustment"
          entityNamePlural="Stock Adjustments"
          data={dataWithOptimistic}
          columns={columns as unknown as import('@/components/ui/data-table').Column<Record<string, unknown>>[]}
          formWidth="50%"
          formFields={formFields}
          keyExtractor={(item) => (item as { id: string | number }).id}
          onCreate={handleCreateStockAdjustment}
          onUpdate={handleUpdateStockAdjustment}
          onDelete={handleDeleteStockAdjustment}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          searchPlaceholder="Search stock adjustments by reference or notes..."
          isLoading={isLoading}
          isProcessing={isProcessing}
          permissions={{
            create: "inventory.adjustment.create",
            update: "inventory.adjustment.edit",
            delete: "inventory.adjustment.delete",
            view: "inventory.adjustment.read",
          }}
          workflowActions={workflowActions}
          optimisticUpdates={optimisticUpdates}
          header={StockAdjustmentHeader}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
        />
      </div>
    </PermissionGuard>
  );
}
