import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetSalesOrdersQuery,
  useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  useConfirmSalesOrderMutation,
  useShipSalesOrderMutation,
  useDeliverSalesOrderMutation,
  useCancelSalesOrderMutation,
} from '@/store/api';
import {
  SalesOrderFilters,
  CreateSalesOrderRequest,
  SalesOrderStatus,
  DeliverItemRequest,
} from '@/store/api/salesOrdersApi';
import { useGetItemsQuery } from '@/store/api';
import { useGetWarehousesQuery } from '@/store/api';
import { useGetItemUomsQuery } from '@/store/api';
import { getErrorMessage } from '@/types';

export interface UseSalesOrdersOptions {
  initialParams?: SalesOrderFilters;
}

export function useSalesOrders(options: UseSalesOrdersOptions = {}) {
  const [params, setParams] = useState<SalesOrderFilters>({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  // Query
  const { data: salesOrdersData, isLoading, error, refetch } = useGetSalesOrdersQuery(params);

  // Mutations
  const [createSalesOrder, { isLoading: isCreating }] = useCreateSalesOrderMutation();
  const [updateSalesOrder, { isLoading: isUpdating }] = useUpdateSalesOrderMutation();
  const [deleteSalesOrder, { isLoading: isDeleting }] = useDeleteSalesOrderMutation();
  const [confirmSalesOrder, { isLoading: isConfirming }] = useConfirmSalesOrderMutation();
  const [shipSalesOrder, { isLoading: isShipping }] = useShipSalesOrderMutation();
  const [deliverSalesOrder, { isLoading: isDelivering }] = useDeliverSalesOrderMutation();
  const [cancelSalesOrder, { isLoading: isCancelling }] = useCancelSalesOrderMutation();

  // Fetch dependencies for form options
  const { data: items = [] } = useGetItemsQuery({ isActive: true });
  const { data: warehouses = [] } = useGetWarehousesQuery({});
  const { data: uoms = [] } = useGetItemUomsQuery();

  // Handlers
  const handleCreate = async (formData: CreateSalesOrderRequest) => {
    try {
      await createSalesOrder(formData).unwrap();
      toast.success('Sales order created successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to create sales order');
      return false;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<CreateSalesOrderRequest>) => {
    try {
      await updateSalesOrder({ id, body: formData }).unwrap();
      toast.success('Sales order updated successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to update sales order');
      return false;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteSalesOrder(id).unwrap();
      toast.success('Sales order deleted successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to delete sales order');
      return false;
    }
  };

  const handleConfirm = async (id: string | number, notes?: string, approvedBy?: number) => {
    try {
      await confirmSalesOrder({ id, body: { notes, approvedBy } }).unwrap();
      toast.success('Sales order confirmed successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to confirm sales order');
      return false;
    }
  };

  const handleShip = async (id: string | number, notes?: string, shippedBy?: number) => {
    try {
      await shipSalesOrder({ id, body: { notes, shippedBy } }).unwrap();
      toast.success('Sales order shipped successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to ship sales order');
      return false;
    }
  };

  const handleDeliver = async (id: string | number, deliveredItems: DeliverItemRequest[], notes?: string, deliveredBy?: number) => {
    try {
      await deliverSalesOrder({ id, body: { deliveredItems, notes, deliveredBy } }).unwrap();
      toast.success('Items delivered successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to deliver items');
      return false;
    }
  };

  const handleCancel = async (id: string | number, reason?: string, notes?: string) => {
    try {
      await cancelSalesOrder({ id, body: { reason, notes } }).unwrap();
      toast.success('Sales order cancelled successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to cancel sales order');
      return false;
    }
  };

  // Update params
  const updateParams = (newParams: Partial<SalesOrderFilters>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  // Dynamic options for form fields
  const itemOptions = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => ({
      value: item.id.toString(),
      label: `${item.code} - ${item.name}`,
    }));
  }, [items]);

  const warehouseOptions = useMemo(() => {
    if (!warehouses || !Array.isArray(warehouses)) return [];
    return warehouses.map(warehouse => ({
      value: warehouse.id.toString(),
      label: warehouse.name,
    }));
  }, [warehouses]);

  const uomOptions = useMemo(() => {
    if (!uoms || !Array.isArray(uoms)) return [];
    return uoms.map(uom => ({
      value: uom.id.toString(),
      label: `${uom.code} - ${uom.name}`,
    }));
  }, [uoms]);

  // Stats
  const stats = useMemo(() => {
    if (!salesOrdersData?.data) return null;

    const total = salesOrdersData.data.length;
    const draft = salesOrdersData.data.filter((o) => o.status === SalesOrderStatus.DRAFT).length;
    const confirmed = salesOrdersData.data.filter((o) => o.status === SalesOrderStatus.CONFIRMED).length;
    const shipped = salesOrdersData.data.filter((o) => o.status === SalesOrderStatus.SHIPPED).length;
    const delivered = salesOrdersData.data.filter((o) => o.status === SalesOrderStatus.DELIVERED).length;
    const cancelled = salesOrdersData.data.filter((o) => o.status === SalesOrderStatus.CANCELLED).length;

    return {
      total,
      draft,
      confirmed,
      shipped,
      delivered,
      cancelled,
    };
  }, [salesOrdersData]);

  return {
    // Data
    salesOrders: salesOrdersData?.data || [],
    meta: salesOrdersData?.meta,
    stats,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isConfirming,
    isShipping,
    isDelivering,
    isCancelling,

    // Error
    error,

    // Params
    params,
    updateParams,

    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    handleConfirm,
    handleShip,
    handleDeliver,
    handleCancel,
    refetch,

    // Options
    itemOptions,
    warehouseOptions,
    uomOptions,
  };
}

export type UseSalesOrdersReturn = ReturnType<typeof useSalesOrders>;
