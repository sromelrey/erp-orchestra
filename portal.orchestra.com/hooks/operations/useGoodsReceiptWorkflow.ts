import { useState, useMemo, useCallback } from 'react';
import { useOptimisticWorkflow } from '@/lib/workflows/useOptimisticWorkflow';
import { buildWorkflowActions } from '@/lib/workflows/builders';
import { goodsReceiptWorkflow } from '@/lib/workflows/goodsReceiptWorkflow';
import { WorkflowConfig } from '@/lib/workflows/types';
import { GoodsReceiptStatus, GoodsReceipt } from '@/store/api/goodsReceiptsApi';

interface UseGoodsReceiptWorkflowProps {
  handleConfirm: (id: string | number, notes?: string, confirmedBy?: number) => Promise<boolean>;
  handleCancel: (id: string | number, reason?: string, notes?: string) => Promise<boolean>;
  goodsReceipts: Record<string, unknown>[];
  userId?: number;
  refetch?: () => void; // Add refetch callback
}

export function useGoodsReceiptWorkflow({
  handleConfirm,
  handleCancel,
  goodsReceipts,
  userId,
  refetch,
}: UseGoodsReceiptWorkflowProps) {
  const { optimisticUpdates, loadingActions, executeAction, mergeWithOptimistic } =
    useOptimisticWorkflow<GoodsReceiptStatus, Record<string, unknown>>();

  const [currentOpenItemId, setCurrentOpenItemId] = useState<string | number | null>(null);

  const isProcessing = currentOpenItemId ? loadingActions.has(currentOpenItemId) : false;

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentOpenItemId((item as unknown as GoodsReceipt).id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCurrentOpenItemId(null);
  }, []);

  const currentStatus = currentOpenItemId
    ? (goodsReceipts.find((gr) => (gr as unknown as GoodsReceipt).id === currentOpenItemId) as unknown as GoodsReceipt)?.status
    : undefined;

  // Helper to create workflow handlers
  const createWorkflowHandler = useCallback(
    (
      handler: (id: string | number) => Promise<boolean>,
      targetStatus: GoodsReceiptStatus
    ) => {
      return async (id: string | number, item: Record<string, unknown>) => {
        setCurrentOpenItemId(id);
        console.log('[Workflow] Starting action', { id, targetStatus });
        
        const result = await executeAction(
          id,
          item as unknown as GoodsReceipt as unknown as Record<string, unknown>,
          targetStatus,
          handler,
          goodsReceiptWorkflow as unknown as WorkflowConfig<GoodsReceiptStatus, Record<string, unknown>>,
          'status' as keyof Record<string, unknown>,
          userId
        );
        
        // If action was successful, trigger refetch after a short delay to allow optimistic state to be visible
        if (result && refetch) {
          console.log('[Workflow] Action successful, scheduling refetch');
          setTimeout(() => {
            console.log('[Workflow] Executing refetch');
            refetch();
          }, 300); // Small delay to show optimistic update before refetch
        }
        
        // Return the actual result from the handler, not just true
        // Ensure boolean return type (undefined becomes false)
        return result ?? false;
      };
    },
    [executeAction, userId, refetch]
  );

  const workflowActions = useMemo(() => {
    return buildWorkflowActions<GoodsReceiptStatus, Record<string, unknown>>({
      workflow: goodsReceiptWorkflow,
      currentStatus: currentStatus as GoodsReceiptStatus | undefined,
      itemId: currentOpenItemId || undefined,
      handlers: {
        confirm: createWorkflowHandler(
          (id) => handleConfirm(id, 'Goods receipt confirmed', userId),
          GoodsReceiptStatus.CONFIRMED
        ),
        cancel: createWorkflowHandler(
          (id) => handleCancel(id, 'Goods receipt cancelled', 'Cancelled by user'),
          GoodsReceiptStatus.CANCELLED
        ),
      },
      loadingActions,
    });
  }, [currentStatus, currentOpenItemId, loadingActions, createWorkflowHandler, handleConfirm, handleCancel, userId]);

  return {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen,
    handleCloseForm,
  };
}
