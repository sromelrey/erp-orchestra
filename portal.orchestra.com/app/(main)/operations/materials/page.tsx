'use client';

import { Package, Box, Wrench, Settings } from 'lucide-react';
import { EntityManager, StatCard } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';
import { useMaterials } from '@/hooks/operations/useMaterials';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { MaterialType, CreateMaterialRequest } from '@/store/api/materialsApi';

const getMaterialIcon = (type: MaterialType) => {
  switch (type) {
    case MaterialType.RAW:
      return Package;
    case MaterialType.SEMI_FINISHED:
      return Wrench;
    case MaterialType.FINISHED:
      return Box;
    case MaterialType.SERVICE:
      return Settings;
    default:
      return Package;
  }
};

export default function MaterialsPage() {
  const {
    materials,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useMaterials();

  const statsCards: StatCard[] = stats
    ? [
        {
          label: 'Total Materials',
          value: stats.total,
          icon: Package,
          color: 'bg-primary/10 text-primary',
        },
        {
          label: 'Active Materials',
          value: stats.active,
          icon: Package,
          color: 'bg-green-100 text-green-700',
        },
        {
          label: 'Raw Materials',
          value: stats.raw,
          icon: getMaterialIcon(MaterialType.RAW),
          color: 'bg-blue-100 text-blue-700',
        },
        {
          label: 'Finished Goods',
          value: stats.finished,
          icon: getMaterialIcon(MaterialType.FINISHED),
          color: 'bg-emerald-100 text-emerald-700',
        },
      ]
    : [];

  // Handle form submission with proper type conversion
  const handleCreateMaterial = async (formData: Partial<CreateMaterialRequest>) => {
    // Convert boolean isActive from string if needed
    const processedData = {
      ...formData,
      isActive: formData.isActive === true || formData.isActive === 'true',
    };
    await handleCreate(processedData);
  };

  const handleUpdateMaterial = async (
    id: string | number,
    formData: Partial<CreateMaterialRequest>
  ) => {
    // Convert boolean isActive from string if needed
    const processedData = {
      ...formData,
      isActive: formData.isActive === true || formData.isActive === 'true',
    };
    await handleUpdate(id, processedData);
  };

  const handleDeleteMaterial = async (id: string | number) => {
    await handleDelete(id);
  };

  return (
    <PermissionGuard permission="operations.materials.view">
      <div className="p-6">
        <EntityManager
          entityName="Material"
          entityNamePlural="Materials"
          data={materials}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          onCreate={handleCreateMaterial}
          onUpdate={handleUpdateMaterial}
          onDelete={handleDeleteMaterial}
          stats={statsCards}
          searchPlaceholder="Search materials by SKU or name..."
          isLoading={isLoading || isCreating || isUpdating || isDeleting}
          permissions={{
            create: 'operations.materials.manage',
            update: 'operations.materials.manage',
            delete: 'operations.materials.manage',
            view: 'operations.materials.view',
          }}
        />
      </div>
    </PermissionGuard>
  );
}
