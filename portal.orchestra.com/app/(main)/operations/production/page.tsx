'use client';

import { useState, useMemo, useCallback } from 'react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { ProductionHeader } from '@/components/production/ProductionHeader';
import { ProductionStats } from '@/components/production/ProductionStats';
import { useProductionBatches } from '@/hooks/operations/useProductionBatches';
import { useProductionWorkflow } from '@/hooks/operations/useProductionWorkflow';
import { useProductionStats } from '@/hooks/operations/useProductionStats';
import { columns } from './column';
import { getFormFields } from './form-fields';
import { ProductionStatus, ProductionBatch, CreateProductionBatchRequest, UpdateProductionBatchRequest } from '@/store/api/productionApi';

export default function ProductionPage() {
  const [currentEditStatus, setCurrentEditStatus] = useState<ProductionStatus | undefined>(undefined);

  const {
    productionBatches,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isStarting,
    isCompleting,
    isCancelling,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStart,
    handleComplete,
    handleCancel,
    refetch,
    bomOptions,
  } = useProductionBatches();

  const { statsCards } = useProductionStats({ productionBatches });

  const {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen: handleWorkflowFormOpen,
  } = useProductionWorkflow({
    handleStart: async (id) => handleStart(id),
    handleComplete: async (id) => handleComplete(id),
    handleCancel: async (id, reason) => handleCancel(id, reason),
    productionBatches: productionBatches as unknown as Record<string, unknown>[],
    userId: 1,
    refetch,
  });

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentEditStatus((item as unknown as ProductionBatch).status);
    handleWorkflowFormOpen(item);
  }, [handleWorkflowFormOpen]);

  const handleFormClose = useCallback(() => {
    setCurrentEditStatus(undefined);
    return true;
  }, []);

  const batchesWithOptimistic = mergeWithOptimistic(
    productionBatches as unknown as Record<string, unknown>[]
  );

  const isRowEditable = useCallback((item: Record<string, unknown>) => {
    return (item as unknown as ProductionBatch).status === ProductionStatus.PLANNED;
  }, []);

  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    return (item as unknown as ProductionBatch).status === ProductionStatus.PLANNED;
  }, []);

  const formFields = useMemo(() => {
    return getFormFields({
      bomOptions,
      currentStatus: currentEditStatus,
      isProcessing,
    });
  }, [bomOptions, currentEditStatus, isProcessing]);

  const handleCreateBatch = async (formData: Partial<CreateProductionBatchRequest>) => {
    if (!formData.bomId || !formData.plannedQuantity) {
      throw new Error('BOM and Planned Quantity are required');
    }
    await handleCreate({
      bomId: Number(formData.bomId),
      plannedQuantity: Number(formData.plannedQuantity),
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes,
      workOrders: formData.workOrders,
    });
  };

  const handleUpdateBatch = async (id: string | number, formData: Partial<UpdateProductionBatchRequest>) => {
    await handleUpdate(id, formData);
  };

  const handleDeleteBatch = async (id: string | number) => {
    await handleDelete(id);
  };

  return (
    <PermissionGuard permission="operations.production.view">
      <div className="p-6 space-y-6">
        <ProductionStats statsCards={statsCards} />

        <EntityManager
          entityName="Production Batch"
          entityNamePlural="Production Batches"
          data={batchesWithOptimistic as unknown as Record<string, unknown>[]}
          columns={columns as unknown as import('@/components/ui/data-table').Column<Record<string, unknown>>[]}
          formFields={formFields}
          formWidth="45%"
          keyExtractor={(item) => (item as unknown as { id: string | number }).id}
          onCreate={handleCreateBatch}
          onUpdate={handleUpdateBatch}
          onDelete={handleDeleteBatch}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          isLoading={isLoading}
          isMutating={isCreating || isUpdating || isDeleting}
          workflowActions={workflowActions}
          isProcessing={isProcessing || isStarting || isCompleting || isCancelling}
          optimisticUpdates={optimisticUpdates}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
          header={ProductionHeader}
          permissions={{
            create: 'operations.production.create',
            update: 'operations.production.update',
            delete: 'operations.production.delete',
          }}
        />
      </div>
    </PermissionGuard>
  );
}
