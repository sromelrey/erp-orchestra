'use client';

import { useState, useMemo, useCallback } from 'react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { useBoms } from '@/hooks/operations/useBoms';
import { columns } from './column';
import { getFormFields } from './form-fields';
import { CreateBomRequest, UpdateBomRequest, Bom } from '@/store/api/bomApi';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

export default function BomPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    boms,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isActivating,
    isDeactivating,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleActivate,
    handleDeactivate,
    refetch,
    finishedGoodsOptions,
    rawMaterialsOptions,
  } = useBoms();

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: 'Total BOMs',
        value: stats.total,
        icon: Activity,
        color: 'bg-blue-500/10 text-blue-600',
      },
      {
        label: 'Active',
        value: stats.active,
        icon: CheckCircle,
        color: 'bg-green-500/10 text-green-600',
      },
      {
        label: 'Inactive',
        value: stats.inactive,
        icon: XCircle,
        color: 'bg-gray-500/10 text-gray-600',
      },
    ];
  }, [stats]);

  const isRowEditable = useCallback((item: Record<string, unknown>) => {
    return !(item as unknown as Bom).isActive;
  }, []);

  const isRowDeletable = useCallback((item: Record<string, unknown>) => {
    return !(item as unknown as Bom).isActive;
  }, []);

  const formFields = useMemo(() => {
    return getFormFields({
      finishedGoodsOptions,
      rawMaterialsOptions,
      isEditable: true,
    });
  }, [finishedGoodsOptions, rawMaterialsOptions]);

  const handleCreateBom = async (formData: Partial<CreateBomRequest>) => {
    if (!formData.code || !formData.name || !formData.parentMaterialId || !formData.version || !formData.lines?.length) {
      throw new Error('Code, Name, Finished Good, Version, and at least one component line are required');
    }
    await handleCreate({
      code: formData.code,
      name: formData.name,
      parentMaterialId: Number(formData.parentMaterialId),
      version: formData.version,
      effectiveDate: formData.effectiveDate ? new Date(formData.effectiveDate).toISOString() : undefined,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
      lines: formData.lines.map((line) => ({
        componentMaterialId: Number(line.componentMaterialId),
        quantity: Number(line.quantity),
        uom: line.uom,
        scrapPercentage: line.scrapPercentage ? Number(line.scrapPercentage) : undefined,
      })),
    });
  };

  const handleUpdateBom = async (id: string | number, formData: Partial<UpdateBomRequest>) => {
    const updateData: UpdateBomRequest = {};
    if (formData.code) updateData.code = formData.code;
    if (formData.name) updateData.name = formData.name;
    if (formData.version) updateData.version = formData.version;
    if (formData.effectiveDate) updateData.effectiveDate = new Date(formData.effectiveDate).toISOString();
    if (formData.expiryDate) updateData.expiryDate = new Date(formData.expiryDate).toISOString();
    if (formData.lines) {
      updateData.lines = formData.lines.map((line) => ({
        componentMaterialId: Number(line.componentMaterialId),
        quantity: Number(line.quantity),
        uom: line.uom,
        scrapPercentage: line.scrapPercentage ? Number(line.scrapPercentage) : undefined,
      }));
    }
    await handleUpdate(id, updateData);
  };

  const handleDeleteBom = async (id: string | number) => {
    await handleDelete(id);
  };

  const handleActivateBom = useCallback(async (bom: Record<string, unknown>) => {
    setIsProcessing(true);
    try {
      await handleActivate((bom as unknown as Bom).id);
      refetch();
    } finally {
      setIsProcessing(false);
    }
  }, [handleActivate, refetch]);

  const handleDeactivateBom = useCallback(async (bom: Record<string, unknown>) => {
    setIsProcessing(true);
    try {
      await handleDeactivate((bom as unknown as Bom).id);
      refetch();
    } finally {
      setIsProcessing(false);
    }
  }, [handleDeactivate, refetch]);

  const workflowActions = useMemo(() => {
    return [
      {
        label: 'Activate',
        icon: CheckCircle,
        onClick: handleActivateBom,
        permission: 'operations.bom.manage',
        isVisible: (item: Record<string, unknown>) => !(item as unknown as Bom).isActive,
        variant: 'default' as const,
        isLoading: isActivating,
      },
      {
        label: 'Deactivate',
        icon: XCircle,
        onClick: handleDeactivateBom,
        permission: 'operations.bom.manage',
        isVisible: (item: Record<string, unknown>) => (item as unknown as Bom).isActive,
        variant: 'outline' as const,
        isLoading: isDeactivating,
      },
    ];
  }, [handleActivateBom, handleDeactivateBom, isActivating, isDeactivating]);

  return (
    <PermissionGuard permission="operations.bom.view">
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className="text-2xl font-bold mt-2">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Entity Manager */}
        <EntityManager
          entityName="BOM"
          entityNamePlural="BOMs"
          data={boms as unknown as Record<string, unknown>[]}
          columns={columns as unknown as import('@/components/ui/data-table').Column<Record<string, unknown>>[]}
          formFields={formFields}
          formWidth="50%"
          keyExtractor={(item) => (item as unknown as { id: string | number }).id}
          onCreate={handleCreateBom}
          onUpdate={handleUpdateBom}
          onDelete={handleDeleteBom}
          isLoading={isLoading}
          isMutating={isCreating || isUpdating || isDeleting}
          workflowActions={workflowActions}
          isProcessing={isProcessing || isActivating || isDeactivating}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
          searchPlaceholder="Search BOMs by code or name..."
          permissions={{
            create: 'operations.bom.manage',
            update: 'operations.bom.manage',
            delete: 'operations.bom.manage',
            view: 'operations.bom.view',
          }}
        />
      </div>
    </PermissionGuard>
  );
}
