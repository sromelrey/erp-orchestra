"use client";

import { useState, useMemo, useCallback } from 'react';
import { useOptimisticWorkflow } from '@/lib/workflows/useOptimisticWorkflow';
import { buildWorkflowActions } from '@/lib/workflows/builders';
import { stockTransferWorkflow, StockTransferStatus } from '@/lib/workflows/stockTransferWorkflow';
import { WorkflowConfig } from '@/lib/workflows/types';
import { StockTransfer } from '@/store/api/stockTransfersApi';

interface UseStockTransferWorkflowProps {
  handleApprove: (id: string | number) => Promise<boolean>;
  handleCancel: (id: string | number) => Promise<boolean>;
  stockTransfers: Record<string, unknown>[];
  refetch?: () => void;
}

export function useStockTransferWorkflow({
  handleApprove,
  handleCancel,
  stockTransfers,
  refetch,
}: UseStockTransferWorkflowProps) {
  const { optimisticUpdates, loadingActions, executeAction, mergeWithOptimistic } =
    useOptimisticWorkflow<StockTransferStatus, Record<string, unknown>>();

  const [currentOpenItemId, setCurrentOpenItemId] = useState<string | number | null>(null);

  const isProcessing = currentOpenItemId ? loadingActions.has(currentOpenItemId) : false;

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentOpenItemId((item as unknown as StockTransfer).id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCurrentOpenItemId(null);
  }, []);

  const currentStatus = currentOpenItemId && Array.isArray(stockTransfers)
    ? (stockTransfers.find((st) => (st as unknown as StockTransfer).id === currentOpenItemId) as unknown as StockTransfer)?.status as StockTransferStatus
    : 'PENDING' as StockTransferStatus;

  const createWorkflowHandler = useCallback(
    (
      handler: (id: string | number) => Promise<boolean>,
      targetStatus: StockTransferStatus
    ) => {
      return async (id: string | number, item: Record<string, unknown>) => {
        setCurrentOpenItemId(id);

        const result = await executeAction(
          id,
          item as unknown as StockTransfer as unknown as Record<string, unknown>,
          targetStatus,
          handler,
          stockTransferWorkflow as unknown as WorkflowConfig<StockTransferStatus, Record<string, unknown>>,
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
    return buildWorkflowActions<StockTransferStatus, Record<string, unknown>>({
      workflow: stockTransferWorkflow as unknown as WorkflowConfig<StockTransferStatus, Record<string, unknown>>,
      currentStatus: currentStatus as StockTransferStatus | undefined,
      itemId: currentOpenItemId || undefined,
      handlers: {
        approve: createWorkflowHandler(
          (id) => handleApprove(id),
          'APPROVED' as StockTransferStatus
        ),
        cancel: createWorkflowHandler(
          (id) => handleCancel(id),
          'CANCELLED' as StockTransferStatus
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
