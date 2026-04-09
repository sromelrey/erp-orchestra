import { useState, useMemo, useCallback } from 'react';
import { useOptimisticWorkflow } from '@/lib/workflows/useOptimisticWorkflow';
import { buildWorkflowActions } from '@/lib/workflows/builders';
import { salesOrderWorkflow } from '@/lib/workflows/salesOrderWorkflow';
import { WorkflowConfig } from '@/lib/workflows/types';
import { SalesOrderStatus, SalesOrder, DeliverItemRequest } from '@/store/api/salesOrdersApi';

interface UseSalesOrderWorkflowProps {
  handleConfirm: (id: string | number, notes?: string, approvedBy?: number) => Promise<boolean>;
  handleShip: (id: string | number, notes?: string, shippedBy?: number) => Promise<boolean>;
  handleCancel: (id: string | number, reason?: string, notes?: string) => Promise<boolean>;
  handleDeliver: (id: string | number, deliveredItems: DeliverItemRequest[], notes?: string, deliveredBy?: number) => Promise<boolean>;
  salesOrders: Record<string, unknown>[];
  userId?: number;
}

export function useSalesOrderWorkflow({
  handleConfirm,
  handleShip,
  handleCancel,
  handleDeliver,
  salesOrders,
  userId,
}: UseSalesOrderWorkflowProps) {
  const { optimisticUpdates, loadingActions, executeAction, mergeWithOptimistic } =
    useOptimisticWorkflow<SalesOrderStatus, Record<string, unknown>>();

  const [currentOpenItemId, setCurrentOpenItemId] = useState<string | number | null>(null);
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [deliveryOrderId, setDeliveryOrderId] = useState<string | number | null>(null);

  const isProcessing = currentOpenItemId ? loadingActions.has(currentOpenItemId) : false;

  const handleFormOpen = useCallback((item: Record<string, unknown>) => {
    setCurrentOpenItemId((item as unknown as SalesOrder).id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCurrentOpenItemId(null);
  }, []);

  const currentStatus = currentOpenItemId
    ? (salesOrders.find((so) => (so as unknown as SalesOrder).id === currentOpenItemId) as unknown as SalesOrder)?.status
    : undefined;

  const handleDeliveryDialogOpen = useCallback((id: string | number) => {
    setDeliveryOrderId(id);
    setDeliveryDialogOpen(true);
  }, []);

  const handleDeliveryDialogConfirm = useCallback(
    async (deliveredItems: DeliverItemRequest[], notes: string) => {
      if (!deliveryOrderId) return;
      setCurrentOpenItemId(deliveryOrderId);
      await executeAction(
        deliveryOrderId,
        salesOrders.find((so) => (so as unknown as SalesOrder).id === deliveryOrderId) as unknown as SalesOrder as unknown as Record<string, unknown>,
        SalesOrderStatus.DELIVERED,
        (id) => handleDeliver(id, deliveredItems, notes, userId),
        salesOrderWorkflow as unknown as WorkflowConfig<SalesOrderStatus, Record<string, unknown>>,
        'status' as keyof Record<string, unknown>,
        userId
      );
      setDeliveryDialogOpen(false);
      setDeliveryOrderId(null);
    },
    [deliveryOrderId, salesOrders, executeAction, handleDeliver, userId]
  );

  const handleDeliveryDialogCancel = useCallback(() => {
    setDeliveryDialogOpen(false);
    setDeliveryOrderId(null);
  }, []);

  // Helper to create workflow handlers
  const createWorkflowHandler = useCallback(
    (
      handler: (id: string | number) => Promise<boolean>,
      targetStatus: SalesOrderStatus
    ) => {
      return async (id: string | number, item: Record<string, unknown>) => {
        setCurrentOpenItemId(id);
        await executeAction(
          id,
          item as unknown as SalesOrder as unknown as Record<string, unknown>,
          targetStatus,
          handler,
          salesOrderWorkflow as unknown as WorkflowConfig<SalesOrderStatus, Record<string, unknown>>,
          'status' as keyof Record<string, unknown>,
          userId
        );
        return true;
      };
    },
    [executeAction, userId]
  );

  const workflowActions = useMemo(() => {
    return buildWorkflowActions<SalesOrderStatus, Record<string, unknown>>({
      workflow: salesOrderWorkflow,
      currentStatus: currentStatus as SalesOrderStatus | undefined,
      itemId: currentOpenItemId || undefined,
      handlers: {
        confirm: createWorkflowHandler(
          (id) => handleConfirm(id, 'Order confirmed for processing', userId),
          SalesOrderStatus.CONFIRMED
        ),
        ship: createWorkflowHandler(
          (id) => handleShip(id, 'Shipped via standard delivery', userId),
          SalesOrderStatus.SHIPPED
        ),
        cancel: createWorkflowHandler(
          (id) => handleCancel(id, 'Order cancelled by user', 'Cancellation processed'),
          SalesOrderStatus.CANCELLED
        ),
        deliver: async (id) => {
          handleDeliveryDialogOpen(id);
          return true;
        },
      },
      loadingActions,
    });
  }, [currentStatus, currentOpenItemId, loadingActions, createWorkflowHandler, handleConfirm, handleShip, handleCancel, userId, handleDeliveryDialogOpen]);

  return {
    workflowActions,
    isProcessing,
    optimisticUpdates,
    mergeWithOptimistic,
    handleFormOpen,
    handleCloseForm,
    deliveryDialogOpen,
    handleDeliveryDialogConfirm,
    handleDeliveryDialogCancel,
    deliveryOrderId,
  };
}
