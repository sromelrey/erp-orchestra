import { useState, useMemo, useCallback } from 'react';
import { useOptimisticWorkflow } from '@/lib/workflows/useOptimisticWorkflow';
import { buildWorkflowActions } from '@/lib/workflows/builders';
import { goodsIssuanceWorkflow, GoodsIssuanceStatus } from '@/lib/workflows/goodsIssuanceWorkflow';
import { WorkflowConfig } from '@/lib/workflows/types';
import { GoodsIssuance } from '@/store/api/goodsIssuanceApi';

interface UseGoodsIssuanceWorkflowProps {
  handleApprove: (id: string | number, notes?: string, approvedBy?: number) => Promise<boolean>;
  handleCancel: (id: string | number, reason?: string, notes?: string) => Promise<boolean>;
  goodsIssuances: Record<string, unknown>[];
  userId?: number;
  refetch?: () => void;
}

export function useGoodsIssuanceWorkflow({
  handleApprove,
  handleCancel,
  goodsIssuances,
  userId,
  refetch,
}: UseGoodsIssuanceWorkflowProps) {
  const { optimisticUpdates, loadingActions, executeAction, mergeWithOptimistic } =
    useOptimisticWorkflow<GoodsIssuanceStatus, Record<string, unknown>>();

  const [currentOpenItemId, setCurrentOpenItemId] = useState<string | number | null>(null);

  const isProcessing = currentOpenItemId ? loadingActions.has(currentOpenItemId) : false;

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentOpenItemId((item as unknown as GoodsIssuance).id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCurrentOpenItemId(null);
  }, []);

  const currentStatus = currentOpenItemId
    ? (goodsIssuances.find((gi) => (gi as unknown as GoodsIssuance).id === currentOpenItemId) as unknown as GoodsIssuance)?.status as GoodsIssuanceStatus
    : 'DRAFT' as GoodsIssuanceStatus; // Default to DRAFT for table view

  // Helper to create workflow handlers
  const createWorkflowHandler = useCallback(
    (
      handler: (id: string | number) => Promise<boolean>,
      targetStatus: GoodsIssuanceStatus
    ) => {
      return async (id: string | number, item: Record<string, unknown>) => {
        setCurrentOpenItemId(id);

        const result = await executeAction(
          id,
          item as unknown as GoodsIssuance as unknown as Record<string, unknown>,
          targetStatus,
          handler,
          goodsIssuanceWorkflow as unknown as WorkflowConfig<GoodsIssuanceStatus, Record<string, unknown>>,
          'status' as keyof Record<string, unknown>,
          userId
        );

        // If action was successful, trigger refetch after a short delay
        if (result && refetch) {
          setTimeout(() => {
            refetch();
            // Clear optimistic updates after refetch completes
            setTimeout(() => {
              // This will be handled by the refetch replacing the data
            }, 100);
          }, 300);
        }

        return result ?? false;
      };
    },
    [executeAction, userId, refetch]
  );

  const workflowActions = useMemo(() => {
    return buildWorkflowActions<GoodsIssuanceStatus, Record<string, unknown>>({
      workflow: goodsIssuanceWorkflow as unknown as WorkflowConfig<GoodsIssuanceStatus, Record<string, unknown>>,
      currentStatus: currentStatus as GoodsIssuanceStatus | undefined,
      itemId: currentOpenItemId || undefined,
      handlers: {
        approve: createWorkflowHandler(
          (id) => handleApprove(id, 'Goods issuance approved through portal'),
          'APPROVED' as GoodsIssuanceStatus
        ),
        cancel: createWorkflowHandler(
          (id) => handleCancel(id, 'Goods issuance cancelled', 'Cancelled by user'),
          'CANCELLED' as GoodsIssuanceStatus
        ),
      },
      loadingActions,
    });
  }, [currentStatus, currentOpenItemId, loadingActions, createWorkflowHandler, handleApprove, handleCancel, userId]);

  return {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen,
    handleCloseForm,
  };
}
