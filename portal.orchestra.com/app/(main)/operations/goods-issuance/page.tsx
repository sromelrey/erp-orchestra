"use client";

import { useMemo, useCallback, useState } from "react";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { EntityManager } from "@/components/entity-manager";
import { GoodsIssuanceHeader } from "@/components/goods-issuance/GoodsIssuanceHeader";
import { columns } from "./column";
import { getFormFields, FormFieldsContext } from "./form-fields";
import { useGoodsIssuance } from "@/hooks/operations/useGoodsIssuance";
import { useGoodsIssuanceWorkflow } from "@/hooks/operations/useGoodsIssuanceWorkflow";
import { useGoodsIssuanceForm } from "@/hooks/operations/useGoodsIssuanceForm";
import { GoodsIssuance } from "@/store/api/goodsIssuanceApi";

export default function GoodsIssuancePage() {
  const {
    data,
    items,
    warehouses,
    locations,
    uoms,
    departments,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleCancel,
    refetch,
  } = useGoodsIssuance();

  const [isFormDirty, setIsFormDirty] = useState(false);

  const { getLocationsByWarehouse } = useGoodsIssuanceForm();

  // Call workflow hook with data
  const {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen: handleWorkflowFormOpen,
    handleCloseForm: handleWorkflowFormClose,
  } = useGoodsIssuanceWorkflow({
    handleApprove,
    handleCancel,
    goodsIssuances: data,
    userId: 1, // TODO: Get from auth context
    refetch,
  });

  // Merge data with optimistic updates
  const dataWithOptimistic = useMemo(() => {
    return mergeWithOptimistic(data);
  }, [data, optimisticUpdates, mergeWithOptimistic]);

  // Form handlers
  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setIsFormDirty(false);
    // Use merged optimistic data to get the latest status
    const mergedItem = mergeWithOptimistic([item as GoodsIssuance])[0];
    handleWorkflowFormOpen(mergedItem);
  }, [mergeWithOptimistic, handleWorkflowFormOpen]);

  const handleFormChange = useCallback(() => {
    setIsFormDirty(true);
  }, []);

  const handleFormClose = useCallback(() => {
    if (isProcessing) {
      return false;
    }
    if (isFormDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) {
        return false;
      }
    }
    handleWorkflowFormClose();
    setIsFormDirty(false);
    return true;
  }, [isProcessing, isFormDirty, handleWorkflowFormClose]);

  // Get form fields with context
  const formFields = useMemo(() => {
    const context: FormFieldsContext = {
      warehouseOptions: (warehouses || []).map(wh => ({
        value: String(wh.id),
        label: `${wh.code} - ${wh.name}`,
      })),
      locationOptions: (locations || []).map(loc => ({
        value: String(loc.id),
        label: loc.name,
      })),
      itemOptions: (items || []).map(item => ({
        value: String(item.id),
        label: `${item.code} - ${item.name}`,
      })),
      uomOptions: (uoms || []).map(uom => ({
        value: String(uom.id),
        label: `${uom.code} - ${uom.name}`,
      })),
      departmentOptions: (departments || []).map(dept => ({
        value: String(dept.id),
        label: dept.name,
      })),
      getLocationsByWarehouse,
      isProcessing,
      currentOpenItem: null,
    };
    return getFormFields(context);
  }, [warehouses, locations, items, uoms, departments, getLocationsByWarehouse, isProcessing]);

  // Check if a row is editable (only DRAFT)
  const isRowEditable = useCallback((item: Record<string, unknown>) => {
    return (item as GoodsIssuance).status === 'DRAFT';
  }, []);

  // Check if a row is deletable (only DRAFT)
  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    return (item as GoodsIssuance).status === 'DRAFT';
  }, []);

  const handleCreateGoodsIssuance = async (formData: Partial<Record<string, unknown>>) => {
    const result = await handleCreate(formData);
    if (result) setIsFormDirty(false);
  };

  const handleUpdateGoodsIssuance = async (id: string | number, formData: Partial<Record<string, unknown>>) => {
    const result = await handleUpdate(id, formData);
    if (result) setIsFormDirty(false);
  };

  const handleDeleteGoodsIssuance = async (id: string | number) => {
    await handleDelete(id);
  };

  return (
    <PermissionGuard permission="goods-issuance.view">
      <div className="p-6 space-y-6">
        <EntityManager
          entityName="Goods Issuance"
          entityNamePlural="Goods Issuances"
          data={dataWithOptimistic as unknown as Record<string, unknown>[]}
          columns={columns as unknown as import('@/components/ui/data-table').Column<Record<string, unknown>>[]}
          formFields={formFields}
          formWidth="50%"
          keyExtractor={(item) => (item as { id: string | number }).id}
          onCreate={handleCreateGoodsIssuance}
          onUpdate={handleUpdateGoodsIssuance}
          onDelete={handleDeleteGoodsIssuance}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          onFormChange={handleFormChange}
          isLoading={isLoading}
          isMutating={isCreating || isUpdating || isDeleting}
          workflowActions={workflowActions as unknown as import('@/lib/workflows/types').WorkflowAction<Record<string, unknown>>[]}
          isProcessing={isProcessing}
          optimisticUpdates={optimisticUpdates}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
          header={GoodsIssuanceHeader}
          permissions={{
            create: "goods-issuance.create",
            update: "goods-issuance.update",
            delete: "goods-issuance.delete",
            view: "goods-issuance.view",
          }}
        />
      </div>
    </PermissionGuard>
  );
}
