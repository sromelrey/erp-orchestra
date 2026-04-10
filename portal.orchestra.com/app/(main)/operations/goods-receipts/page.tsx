'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { GoodsReceiptHeader } from '@/components/goods-receipts/GoodsReceiptHeader';
import { GoodsReceiptStats } from '@/components/goods-receipts/GoodsReceiptStats';
import { useGoodsReceipts } from '@/hooks/operations/useGoodsReceipts';
import { useGoodsReceiptWorkflow } from '@/hooks/operations/useGoodsReceiptWorkflow';
import { useGoodsReceiptForm } from '@/hooks/operations/useGoodsReceiptForm';
import { useGoodsReceiptStats } from '@/hooks/operations/useGoodsReceiptStats';
import { columns } from './column';
import { getFormFields } from './form-fields';
import { GoodsReceiptStatus, CreateGoodsReceiptRequest, UpdateGoodsReceiptRequest } from '@/store/api/goodsReceiptsApi';
import { formatGoodsReceiptForCreate, formatGoodsReceiptForUpdate } from '@/utils/goodsReceiptHelpers';
import { useState, useMemo, useCallback } from 'react';

export default function GoodsReceiptsPage() {
  // Track form dirty state for draft persistence
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Main data hook
  const {
    goodsReceipts,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isConfirming,
    isCancelling,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleConfirm,
    handleCancel,
    refetch,
    itemOptions,
    warehouseOptions,
    uomOptions,
  } = useGoodsReceipts();

  // Form hook for dynamic location fetching
  const { getLocationsByWarehouse } = useGoodsReceiptForm();

  // Stats hook
  const { statsCards } = useGoodsReceiptStats({ goodsReceipts });

  // Track current edit status for conditional rendering
  const [currentEditStatus, setCurrentEditStatus] = useState<GoodsReceiptStatus | undefined>(undefined);

  // Workflow hook - moved before handleFormClose to have isProcessing available
  const {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
  } = useGoodsReceiptWorkflow({
    handleConfirm: async (id, notes, confirmedBy) => {
      const result = await handleConfirm(id, notes, confirmedBy);
      if (result) setIsFormDirty(false);
      return result;
    },
    handleCancel: async (id, reason, notes) => {
      const result = await handleCancel(id, reason, notes);
      if (result) setIsFormDirty(false);
      return result;
    },
    goodsReceipts: goodsReceipts as unknown as Record<string, unknown>[],
    userId: 1, // TODO: Get from auth context
    refetch: refetch, // Pass refetch function
  });

  // 🔹 Enhancement: Form dirty state tracking
  const handleFormChange = useCallback(() => {
    setIsFormDirty(true);
  }, []);

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentEditStatus(item?.status as GoodsReceiptStatus);
    setIsFormDirty(false);
    // Ensure status is always in the form data
    if (item && !('status' in item) && item?.id) {
      // If status is missing, add it from the original data
      const originalItem = goodsReceipts.find(gr => gr.id === item.id);
      if (originalItem) {
        item.status = originalItem.status;
      }
    }
  }, [goodsReceipts]);

  const handleFormClose = useCallback(() => {
    // 🔹 Enhancement: Prevent closing if processing workflow actions
    if (isProcessing) {
      console.log('[GoodsReceipts Page] Preventing form close during processing');
      return false;
    }
    
    // 🔹 Enhancement: Draft persistence - warn if unsaved changes
    if (isFormDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) {
        return false; // Prevent closing
      }
    }
    setCurrentEditStatus(undefined);
    setIsFormDirty(false);
    return true;
  }, [isFormDirty, isProcessing]);

  // Merge data with optimistic updates
  const goodsReceiptsWithOptimistic = useMemo(() => {
    const result = mergeWithOptimistic(goodsReceipts as unknown as Record<string, unknown>[]);
    console.log('[GoodsReceipts Page] Data being passed to EntityManager:', {
      goodsReceiptsLength: goodsReceipts?.length,
      goodsReceiptsWithOptimisticLength: result?.length,
      firstItem: result?.[0],
      firstItemKeys: result?.[0] ? Object.keys(result[0]) : null,
      isLoading
    });
    return result;
  }, [goodsReceipts, mergeWithOptimistic, optimisticUpdates, isLoading]);

  // Check if a row is editable (only DRAFT)
  const isRowEditable = useCallback((item: Record<string, unknown>) => {
    const status = item?.status as GoodsReceiptStatus;
    return status === GoodsReceiptStatus.DRAFT;
  }, []);

  // Check if a row is deletable (only DRAFT)
  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    const status = item?.status as GoodsReceiptStatus;
    return status === GoodsReceiptStatus.DRAFT;
  }, []);

  // Form fields with context
  const formFields = useMemo(() => {
    return getFormFields({
      itemOptions,
      uomOptions,
      warehouseOptions,
      locationOptions: [], // This is handled dynamically by getLocationsByWarehouse
      getLocationsByWarehouse,
      currentStatus: currentEditStatus,
    });
  }, [itemOptions, uomOptions, warehouseOptions, getLocationsByWarehouse, currentEditStatus]);

  const handleCreateGoodsReceipt = async (formData: Partial<CreateGoodsReceiptRequest>) => {
    const { data, errors } = formatGoodsReceiptForCreate(formData);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(', '));
    }
    const result = await handleCreate(data);
    if (result) setIsFormDirty(false);
  };

  const handleUpdateGoodsReceipt = async (id: string | number, formData: Partial<UpdateGoodsReceiptRequest>) => {
    const data = formatGoodsReceiptForUpdate(formData);
    const result = await handleUpdate(id, data);
    if (result) setIsFormDirty(false);
  };

  const handleDeleteGoodsReceipt = async (id: string | number) => {
    await handleDelete(id);
  };

  return (
    <PermissionGuard permission="operations.goods-receipt.view">
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <GoodsReceiptStats statsCards={statsCards} />

        {/* Entity Manager */}
        <EntityManager
          entityName="Goods Receipt"
          entityNamePlural="Goods Receipts"
          data={goodsReceiptsWithOptimistic as unknown as Record<string, unknown>[]}
          columns={columns as unknown as import('@/components/ui/data-table').Column<Record<string, unknown>>[]}
          formFields={formFields}
          formWidth="50%"
          keyExtractor={(item) => (item as unknown as { id: string | number }).id}
          onCreate={handleCreateGoodsReceipt}
          onUpdate={handleUpdateGoodsReceipt}
          onDelete={handleDeleteGoodsReceipt}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          onFormChange={handleFormChange}
          isLoading={isLoading}
          isMutating={isCreating || isUpdating || isDeleting}
          workflowActions={workflowActions}
          isProcessing={isProcessing || isConfirming || isCancelling}
          optimisticUpdates={optimisticUpdates}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
          header={GoodsReceiptHeader}
          permissions={{
            create: 'operations.goods-receipt.create',
            update: 'operations.goods-receipt.update',
            delete: 'operations.goods-receipt.delete',
          }}
        />
      </div>
    </PermissionGuard>
  );
}
