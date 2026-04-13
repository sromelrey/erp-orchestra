import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetBomsListQuery,
  useCreateBomMutation,
  useUpdateBomMutation,
  useDeleteBomMutation,
  useActivateBomMutation,
  useDeactivateBomMutation,
} from '@/store/api';
import { useGetMaterialsQuery, MaterialType } from '@/store/api/materialsApi';
import {
  BomFilters,
  CreateBomRequest,
  UpdateBomRequest,
} from '@/store/api/bomApi';
import { getErrorMessage } from '@/types';

export interface UseBomsOptions {
  initialParams?: BomFilters;
}

export function useBoms(options: UseBomsOptions = {}) {
  const [params, setParams] = useState<BomFilters>({
    limit: 20,
    ...options.initialParams,
  });

  const { data: bomsData, isLoading, error, refetch } = useGetBomsListQuery(params);
  const { data: materialsData } = useGetMaterialsQuery({ limit: 100 });

  const [createBom, { isLoading: isCreating }] = useCreateBomMutation();
  const [updateBom, { isLoading: isUpdating }] = useUpdateBomMutation();
  const [deleteBom, { isLoading: isDeleting }] = useDeleteBomMutation();
  const [activateBom, { isLoading: isActivating }] = useActivateBomMutation();
  const [deactivateBom, { isLoading: isDeactivating }] = useDeactivateBomMutation();

  const handleCreate = async (formData: CreateBomRequest) => {
    try {
      await createBom(formData).unwrap();
      toast.success('BOM created successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to create BOM');
      return false;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<UpdateBomRequest>) => {
    try {
      await updateBom({ id, body: formData as UpdateBomRequest }).unwrap();
      toast.success('BOM updated successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to update BOM');
      return false;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteBom(id).unwrap();
      toast.success('BOM deleted successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to delete BOM');
      return false;
    }
  };

  const handleActivate = async (id: string | number) => {
    try {
      await activateBom(id).unwrap();
      toast.success('BOM activated successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to activate BOM');
      return false;
    }
  };

  const handleDeactivate = async (id: string | number) => {
    try {
      await deactivateBom(id).unwrap();
      toast.success('BOM deactivated successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to deactivate BOM');
      return false;
    }
  };

  const updateParams = (newParams: Partial<BomFilters>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const finishedGoodsOptions = useMemo(() => {
    if (!materialsData?.data) return [];
    return materialsData.data
      .filter((material) => material.materialType === MaterialType.FINISHED)
      .map((material) => ({
        value: material.id.toString(),
        label: `${material.sku} - ${material.name}`,
      }));
  }, [materialsData]);

  const rawMaterialsOptions = useMemo(() => {
    if (!materialsData?.data) return [];
    return materialsData.data
      .filter((material) => material.materialType === MaterialType.RAW)
      .map((material) => ({
        value: material.id.toString(),
        label: `${material.sku} - ${material.name}`,
      }));
  }, [materialsData]);

  const stats = useMemo(() => {
    if (!bomsData?.data) return null;
    const boms = bomsData.data;
    return {
      total: boms.length,
      active: boms.filter((b) => b.isActive).length,
      inactive: boms.filter((b) => !b.isActive).length,
    };
  }, [bomsData]);

  return {
    boms: bomsData?.data || [],
    meta: bomsData?.meta || { nextCursor: null },
    stats,

    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isActivating,
    isDeactivating,

    error,
    params,
    updateParams,

    handleCreate,
    handleUpdate,
    handleDelete,
    handleActivate,
    handleDeactivate,
    refetch,

    finishedGoodsOptions,
    rawMaterialsOptions,
  };
}
