import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  MaterialsQueryParams,
  CreateMaterialRequest,
  MaterialType,
} from '@/store/api/materialsApi';
import { getErrorMessage } from '@/types';

export interface UseMaterialsOptions {
  initialParams?: MaterialsQueryParams;
}

export function useMaterials(options: UseMaterialsOptions = {}) {
  const [params, setParams] = useState<MaterialsQueryParams>({
    page: 1,
    limit: 20,
    isActive: true,
    ...options.initialParams,
  });

  // Query
  const { data: materialsData, isLoading, error, refetch } = useGetMaterialsQuery(params);

  // Mutations
  const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation();
  const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation();
  const [deleteMaterial, { isLoading: isDeleting }] = useDeleteMaterialMutation();

  // Handlers
  const handleCreate = async (formData: CreateMaterialRequest) => {
    try {
      await createMaterial(formData).unwrap();
      toast.success('Material created successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to create material');
      return false;
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<CreateMaterialRequest>) => {
    try {
      await updateMaterial({ id, body: formData }).unwrap();
      toast.success('Material updated successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to update material');
      return false;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMaterial(id).unwrap();
      toast.success('Material deleted successfully');
      refetch();
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to delete material');
      return false;
    }
  };

  // Update params
  const updateParams = (newParams: Partial<MaterialsQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  // Material type options
  const materialTypeOptions = useMemo(
    () => [
      { label: 'Raw Material', value: MaterialType.RAW },
      { label: 'Semi-Finished', value: MaterialType.SEMI_FINISHED },
      { label: 'Finished Goods', value: MaterialType.FINISHED },
      { label: 'Service', value: MaterialType.SERVICE },
    ],
    []
  );

  // Stats
  const stats = useMemo(() => {
    if (!materialsData?.data) return null;

    const total = materialsData.data.length;
    const active = materialsData.data.filter((m) => m.isActive).length;
    const raw = materialsData.data.filter((m) => m.materialType === MaterialType.RAW).length;
    const finished = materialsData.data.filter(
      (m) => m.materialType === MaterialType.FINISHED
    ).length;

    return {
      total,
      active,
      inactive: total - active,
      raw,
      finished,
      semiFinished: materialsData.data.filter((m) => m.materialType === MaterialType.SEMI_FINISHED)
        .length,
      services: materialsData.data.filter((m) => m.materialType === MaterialType.SERVICE).length,
    };
  }, [materialsData]);

  return {
    // Data
    materials: materialsData?.data || [],
    meta: materialsData?.meta,
    stats,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Error
    error,

    // Params
    params,
    updateParams,

    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,

    // Options
    materialTypeOptions,
  };
}

export type UseMaterialsReturn = ReturnType<typeof useMaterials>;
