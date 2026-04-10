import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetGoodsReceiptsQuery,
  useCreateGoodsReceiptMutation,
  useUpdateGoodsReceiptMutation,
  useDeleteGoodsReceiptMutation,
  useConfirmGoodsReceiptMutation,
  useCancelGoodsReceiptMutation,
} from '@/store/api';
import {
  GoodsReceiptFilters,
  CreateGoodsReceiptRequest,
  GoodsReceiptStatus,
  ConfirmGoodsReceiptRequest,
} from '@/store/api/goodsReceiptsApi';
import { useGetItemsQuery } from '@/store/api';
import { useGetWarehousesQuery } from '@/store/api';
import { useGetItemUomsQuery } from '@/store/api';
import { getErrorMessage } from '@/types';

export interface UseGoodsReceiptsOptions {
  initialParams?: GoodsReceiptFilters;
}

export function useGoodsReceipts(options: UseGoodsReceiptsOptions = {}) {
  const [params, setParams] = useState<GoodsReceiptFilters>({
    page: 1,
    limit: 20,
    ...options.initialParams,
  });

  // Query
  const { data: goodsReceiptsData, isLoading, error, refetch } = useGetGoodsReceiptsQuery(params);
  
  
  // Mutations
  const [createGoodsReceipt, { isLoading: isCreating }] = useCreateGoodsReceiptMutation();
  const [updateGoodsReceipt, { isLoading: isUpdating }] = useUpdateGoodsReceiptMutation();
  const [deleteGoodsReceipt, { isLoading: isDeleting }] = useDeleteGoodsReceiptMutation();
  const [confirmGoodsReceipt, { isLoading: isConfirming }] = useConfirmGoodsReceiptMutation();
  const [cancelGoodsReceipt, { isLoading: isCancelling }] = useCancelGoodsReceiptMutation();

  // Fetch dependencies for form options
  const { data: items } = useGetItemsQuery({ isActive: true });
  const { data: warehouses } = useGetWarehousesQuery({});
  const { data: uoms } = useGetItemUomsQuery();
  // Note: locations are fetched per-warehouse in useGoodsReceiptForm hook

  // Handlers
  const handleCreate = async (formData: CreateGoodsReceiptRequest) => {
    try {
      await createGoodsReceipt(formData).unwrap();
      toast.success('Goods receipt created successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to create goods receipt');
      return false;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<CreateGoodsReceiptRequest>) => {
    try {
      await updateGoodsReceipt({ id, body: formData }).unwrap();
      toast.success('Goods receipt updated successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to update goods receipt');
      return false;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteGoodsReceipt(id).unwrap();
      toast.success('Goods receipt deleted successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to delete goods receipt');
      return false;
    }
  };

  const handleConfirm = async (id: string | number, notes?: string, _confirmedBy?: number) => {
    try {
      const body: ConfirmGoodsReceiptRequest = { notes };
      await confirmGoodsReceipt({ id, body }).unwrap();
      toast.success('Goods receipt confirmed successfully. Inventory has been updated.');
      // NOTE: Removed immediate refetch to allow optimistic updates to control UI
      // Refetch will be handled by the workflow system after successful update
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to confirm goods receipt');
      return false;
    }
  };

  const handleCancel = async (id: string | number, _reason?: string, _notes?: string) => {
    try {
      await cancelGoodsReceipt(id).unwrap();
      toast.success('Goods receipt cancelled successfully');
      // NOTE: Removed immediate refetch to allow optimistic updates to control UI
      // Refetch will be handled by the workflow system after successful update
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to cancel goods receipt');
      return false;
    }
  };

  // Update params
  const updateParams = (newParams: Partial<GoodsReceiptFilters>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  // Dynamic options for form fields
  const itemOptions = useMemo(() => {
    if (!items) return [];
    return items.map(item => ({
      value: item.id.toString(),
      label: `${item.code} - ${item.name}`,
    }));
  }, [items]);

  const warehouseOptions = useMemo(() => {
    if (!warehouses) return [];
    return warehouses.map(warehouse => ({
      value: warehouse.id.toString(),
      label: `${warehouse.code} - ${warehouse.name}`,
    }));
  }, [warehouses]);

  // Location options are fetched dynamically per warehouse in useGoodsReceiptForm hook

  const uomOptions = useMemo(() => {
    if (!uoms) return [];
    return uoms.map(uom => ({
      value: uom.id.toString(),
      label: `${uom.code} - ${uom.name}`,
    }));
  }, [uoms]);

  // Stats
  const stats = useMemo(() => {
    if (!goodsReceiptsData?.data) return null;

    const receipts = goodsReceiptsData.data;
    const total = receipts.length;
    const draft = receipts.filter((r: { status: GoodsReceiptStatus }) => r.status === GoodsReceiptStatus.DRAFT).length;
    const confirmed = receipts.filter((r: { status: GoodsReceiptStatus }) => r.status === GoodsReceiptStatus.CONFIRMED).length;
    const cancelled = receipts.filter((r: { status: GoodsReceiptStatus }) => r.status === GoodsReceiptStatus.CANCELLED).length;

    return {
      total,
      draft,
      confirmed,
      cancelled,
    };
  }, [goodsReceiptsData]);

  return {
    // Data
    goodsReceipts: goodsReceiptsData?.data || [],
    meta: goodsReceiptsData?.meta || {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
    stats,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isConfirming,
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
    handleCancel,
    refetch,

    // Options
    itemOptions,
    warehouseOptions,
    uomOptions,
    // Note: locationOptions are fetched dynamically via useGoodsReceiptForm hook
  };
}

export type UseGoodsReceiptsReturn = ReturnType<typeof useGoodsReceipts>;
