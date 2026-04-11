import { useState, useMemo, useCallback } from 'react';
import { useOptimisticWorkflow } from '@/lib/workflows/useOptimisticWorkflow';
import { buildWorkflowActions } from '@/lib/workflows/builders';
import { productionWorkflow } from '@/lib/workflows/productionWorkflow';
import { WorkflowConfig } from '@/lib/workflows/types';
import { ProductionStatus, ProductionBatch } from '@/store/api/productionApi';

interface UseProductionWorkflowProps {
  handleStart: (id: string | number) => Promise<boolean>;
  handleComplete: (id: string | number, actualQuantity?: number) => Promise<boolean>;
  handleCancel: (id: string | number, reason?: string) => Promise<boolean>;
  productionBatches: Record<string, unknown>[];
  userId?: number;
  refetch?: () => void;
}

export function useProductionWorkflow({
  handleStart,
  handleComplete,
  handleCancel,
  productionBatches,
  userId,
  refetch,
}: UseProductionWorkflowProps) {
  const { optimisticUpdates, loadingActions, executeAction, mergeWithOptimistic } =
    useOptimisticWorkflow<ProductionStatus, Record<string, unknown>>();

  const [currentOpenItemId, setCurrentOpenItemId] = useState<string | number | null>(null);

  const isProcessing = currentOpenItemId ? loadingActions.has(currentOpenItemId) : false;

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentOpenItemId((item as unknown as ProductionBatch).id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCurrentOpenItemId(null);
  }, []);

  const currentStatus = currentOpenItemId
    ? (productionBatches.find(
        (b) => (b as unknown as ProductionBatch).id === currentOpenItemId
      ) as unknown as ProductionBatch)?.status
    : undefined;

  const createWorkflowHandler = useCallback(
    (
      handler: (id: string | number) => Promise<boolean>,
      targetStatus: ProductionStatus
    ) => {
      return async (id: string | number, item: Record<string, unknown>) => {
        setCurrentOpenItemId(id);

        const result = await executeAction(
          id,
          item as unknown as ProductionBatch as unknown as Record<string, unknown>,
          targetStatus,
          handler,
          productionWorkflow as unknown as WorkflowConfig<ProductionStatus, Record<string, unknown>>,
          'status' as keyof Record<string, unknown>,
          userId
        );

        if (result && refetch) {
          setTimeout(() => {
            refetch();
          }, 300);
        }

        return result ?? false;
      };
    },
    [executeAction, userId, refetch]
  );

  const workflowActions = useMemo(() => {
    return buildWorkflowActions<ProductionStatus, Record<string, unknown>>({
      workflow: productionWorkflow as unknown as WorkflowConfig<ProductionStatus, Record<string, unknown>>,
      currentStatus: currentStatus as ProductionStatus | undefined,
      itemId: currentOpenItemId || undefined,
      handlers: {
        start: createWorkflowHandler(
          (id) => handleStart(id),
          ProductionStatus.IN_PROGRESS
        ),
        complete: createWorkflowHandler(
          (id) => handleComplete(id),
          ProductionStatus.COMPLETED
        ),
        cancel: createWorkflowHandler(
          (id) => handleCancel(id, 'Cancelled by user'),
          ProductionStatus.CANCELLED
        ),
      },
      loadingActions,
    });
  }, [currentStatus, currentOpenItemId, loadingActions, createWorkflowHandler, handleStart, handleComplete, handleCancel]);

  return {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen,
    handleCloseForm,
  };
}
