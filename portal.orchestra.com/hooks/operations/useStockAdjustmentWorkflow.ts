"use client";

import { useState, useMemo, useCallback } from 'react';
import { useOptimisticWorkflow } from '@/lib/workflows/useOptimisticWorkflow';
import { buildWorkflowActions } from '@/lib/workflows/builders';
import { stockAdjustmentWorkflow, StockAdjustmentStatus } from '@/lib/workflows/stockAdjustmentWorkflow';
import { WorkflowConfig } from '@/lib/workflows/types';
import { StockAdjustment } from '@/store/api/stockAdjustmentsApi';

interface UseStockAdjustmentWorkflowProps {
  handleApprove: (id: string | number) => Promise<boolean>;
  handleCancel: (id: string | number) => Promise<boolean>;
  stockAdjustments: Record<string, unknown>[];
  refetch?: () => void;
}

export function useStockAdjustmentWorkflow({
  handleApprove,
  handleCancel,
  stockAdjustments,
  refetch,
}: UseStockAdjustmentWorkflowProps) {
  const { optimisticUpdates, loadingActions, executeAction, mergeWithOptimistic } =
    useOptimisticWorkflow<StockAdjustmentStatus, Record<string, unknown>>();

  const [currentOpenItemId, setCurrentOpenItemId] = useState<string | number | null>(null);

  const isProcessing = currentOpenItemId ? loadingActions.has(currentOpenItemId) : false;

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentOpenItemId((item as unknown as StockAdjustment).id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCurrentOpenItemId(null);
  }, []);

  const currentStatus = currentOpenItemId && Array.isArray(stockAdjustments)
    ? (stockAdjustments.find((sa) => (sa as unknown as StockAdjustment).id === currentOpenItemId) as unknown as StockAdjustment)?.status as StockAdjustmentStatus
    : 'DRAFT' as StockAdjustmentStatus;

  const createWorkflowHandler = useCallback(
    (
      handler: (id: string | number) => Promise<boolean>,
      targetStatus: StockAdjustmentStatus
    ) => {
      return async (id: string | number, item: Record<string, unknown>) => {
        setCurrentOpenItemId(id);

        const result = await executeAction(
          id,
          item as unknown as StockAdjustment as unknown as Record<string, unknown>,
          targetStatus,
          handler,
          stockAdjustmentWorkflow as unknown as WorkflowConfig<StockAdjustmentStatus, Record<string, unknown>>,
          'status' as keyof Record<string, unknown>,
          undefined
        );

        if (result && refetch) {
          setTimeout(() => {
            refetch();
          }, 300);
        }

        return result ?? false;
      };
    },
    [executeAction, refetch]
  );

  const workflowActions = useMemo(() => {
    return buildWorkflowActions<StockAdjustmentStatus, Record<string, unknown>>({
      workflow: stockAdjustmentWorkflow as unknown as WorkflowConfig<StockAdjustmentStatus, Record<string, unknown>>,
      currentStatus: currentStatus as StockAdjustmentStatus | undefined,
      itemId: currentOpenItemId || undefined,
      handlers: {
        approve: createWorkflowHandler(
          (id) => handleApprove(id),
          'APPROVED' as StockAdjustmentStatus
        ),
        cancel: createWorkflowHandler(
          (id) => handleCancel(id),
          'CANCELLED' as StockAdjustmentStatus
        ),
      },
      loadingActions,
    });
  }, [currentStatus, currentOpenItemId, loadingActions, createWorkflowHandler, handleApprove, handleCancel]);

  return {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen,
    handleCloseForm,
  };
}
