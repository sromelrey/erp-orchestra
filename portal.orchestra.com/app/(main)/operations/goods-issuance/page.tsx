"use client";

import { useMemo, useCallback } from "react";
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
    error,
    params,
    setParams,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleCancel,
    refetch,
  } = useGoodsIssuance();

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
    goodsIssuances: data as unknown as Record<string, unknown>[],
    userId: 1, // TODO: Get from auth context
    refetch,
  });

  // Merge data with optimistic updates
  const dataWithOptimistic = useMemo(() => {
    return mergeWithOptimistic(data as unknown as Record<string, unknown>[]);
  }, [data, optimisticUpdates, mergeWithOptimistic]);

  // Form handlers
  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    // Use merged optimistic data to get the latest status
    const mergedItem = mergeWithOptimistic([item])[0];
    handleWorkflowFormOpen(mergedItem);
  }, [mergeWithOptimistic, handleWorkflowFormOpen]);

  const handleFormClose = useCallback(() => {
    if (isProcessing) {
      return false;
    }
    handleWorkflowFormClose();
    return true;
  }, [isProcessing, handleWorkflowFormClose]);

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
    const status = item?.status as string;
    return status === 'DRAFT';
  }, []);

  // Check if a row is deletable (only DRAFT)
  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    const status = item?.status as string;
    return status === 'DRAFT';
  }, []);

  return (
    <PermissionGuard permission="goods-issuance.view">
      <div className="p-6">
        <EntityManager<GoodsIssuance>
          title="Goods Issuance"
          subtitle="Manage goods issuance for production, sales, transfers, and adjustments"
          columns={columns}
          data={dataWithOptimistic as unknown as GoodsIssuance[]}
          isLoading={isLoading}
          error={error ? (typeof error === 'string' ? error : 'Failed to fetch goods issuances') : null}
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
          header={GoodsIssuanceHeader}
          formWidth="50%"
          keyExtractor={(item) => item.id}
          entityName="Goods Issuance"
          permissions={{
            create: "goods-issuance.create",
            update: "goods-issuance.update",
            delete: "goods-issuance.delete",
          }}
        />
      </div>
    </PermissionGuard>
  );
}
