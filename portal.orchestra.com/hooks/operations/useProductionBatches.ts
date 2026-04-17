import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetProductionBatchesQuery,
  useCreateProductionBatchMutation,
  useUpdateProductionBatchMutation,
  useDeleteProductionBatchMutation,
  useStartProductionBatchMutation,
  useCompleteProductionBatchMutation,
  useCancelProductionBatchMutation,
  useGetBomsQuery,
} from '@/store/api';
import {
  ProductionBatchFilters,
  CreateProductionBatchRequest,
  UpdateProductionBatchRequest,
  ProductionStatus,
} from '@/store/api/productionApi';
import { getErrorMessage } from '@/types';

export interface UseProductionBatchesOptions {
  initialParams?: ProductionBatchFilters;
}

export function useProductionBatches(options: UseProductionBatchesOptions = {}) {
  const [params, setParams] = useState<ProductionBatchFilters>({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  const { data: productionData, isLoading, error, refetch } = useGetProductionBatchesQuery(params);
  const { data: bomsData } = useGetBomsQuery({ limit: 1000 });

  const [createProductionBatch, { isLoading: isCreating }] = useCreateProductionBatchMutation();
  const [updateProductionBatch, { isLoading: isUpdating }] = useUpdateProductionBatchMutation();
  const [deleteProductionBatch, { isLoading: isDeleting }] = useDeleteProductionBatchMutation();
  const [startProductionBatch, { isLoading: isStarting }] = useStartProductionBatchMutation();
  const [completeProductionBatch, { isLoading: isCompleting }] = useCompleteProductionBatchMutation();
  const [cancelProductionBatch, { isLoading: isCancelling }] = useCancelProductionBatchMutation();

  const handleCreate = async (formData: CreateProductionBatchRequest) => {
    try {
      await createProductionBatch(formData).unwrap();
      toast.success('Production batch created successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to create production batch');
      return false;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<UpdateProductionBatchRequest>) => {
    try {
      await updateProductionBatch({ id, body: formData as UpdateProductionBatchRequest }).unwrap();
      toast.success('Production batch updated successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to update production batch');
      return false;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProductionBatch(id).unwrap();
      toast.success('Production batch deleted successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to delete production batch');
      return false;
    }
  };

  const handleStart = async (id: string | number) => {
    try {
      await startProductionBatch(id).unwrap();
      toast.success('Production batch started. Materials have been consumed from inventory.');
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to start production batch');
      return false;
    }
  };

  const handleComplete = async (id: string | number, actualQuantity?: number) => {
    try {
      const batches = productionData?.batches || [];
      const batch = batches.find((b) => b.id === Number(id));
      const qty = actualQuantity ?? batch?.plannedQuantity ?? 0;
      await completeProductionBatch({ id, actualQuantity: qty }).unwrap();
      toast.success('Production batch completed. Finished goods have been added to inventory.');
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to complete production batch');
      return false;
    }
  };

  const handleCancel = async (id: string | number, reason?: string) => {
    try {
      await cancelProductionBatch({ id, reason: reason || 'Cancelled by user' }).unwrap();
      toast.success('Production batch cancelled successfully');
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to cancel production batch');
      return false;
    }
  };

  const updateParams = (newParams: Partial<ProductionBatchFilters>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const bomOptions = useMemo(() => {
    if (!bomsData) return [];
    return bomsData.data.map((bom) => ({
      value: bom.id.toString(),
      label: bom.parentMaterial
        ? `${bom.code || `BOM #${bom.id}`} - ${bom.parentMaterial.name}`
        : bom.code || `BOM #${bom.id}`,
    }));
  }, [bomsData]);

  const stats = useMemo(() => {
    if (!productionData?.batches) return null;
    const batches = productionData.batches;
    return {
      total: batches.length,
      planned: batches.filter((b) => b.status === ProductionStatus.PLANNED).length,
      inProgress: batches.filter((b) => b.status === ProductionStatus.IN_PROGRESS).length,
      completed: batches.filter((b) => b.status === ProductionStatus.COMPLETED).length,
      cancelled: batches.filter((b) => b.status === ProductionStatus.CANCELLED).length,
    };
  }, [productionData]);

  return {
    productionBatches: productionData?.batches || [],
    pagination: productionData?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 },
    stats,

    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isStarting,
    isCompleting,
    isCancelling,

    error,
    params,
    updateParams,

    handleCreate,
    handleUpdate,
    handleDelete,
    handleStart,
    handleComplete,
    handleCancel,
    refetch,

    bomOptions,
  };
}

export type UseProductionBatchesReturn = ReturnType<typeof useProductionBatches>;
