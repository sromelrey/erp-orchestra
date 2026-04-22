'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';
import { useGetAddonsQuery, useCreateAddonMutation, useUpdateAddonMutation, useDeleteAddonMutation, useGetAddonWithRulesQuery } from '@/store/api';
import type { Addon, CreateAddonRequest, UpdateAddonRequest } from '@/store/api/addonsApi';
import { useMemo, useState } from 'react';

export default function AddonsPage() {
  const { data: response, isLoading, error } = useGetAddonsQuery({});
  const addons = useMemo(() => response?.data || [], [response?.data]);
  const [createAddon] = useCreateAddonMutation();
  const [updateAddon] = useUpdateAddonMutation();
  const [deleteAddon] = useDeleteAddonMutation();

  const [currentAddonId, setCurrentAddonId] = useState<number | null>(null);
  const { data: currentAddon, isLoading: isLoadingAddon } = useGetAddonWithRulesQuery(currentAddonId!, { skip: !currentAddonId });

  const errorMessage = error ? (typeof error === 'string' ? error : 'Failed to load addons') : undefined;

  // Transform addon data to match form structure
  const transformedAddon = useMemo(() => {
    if (!currentAddon) return null;
    return {
      ...currentAddon,
      rules: currentAddon.inclusionRules || [],
    };
  }, [currentAddon]);

  // Create optimistic updates map to merge fetched addon data (with rules) into form
  const optimisticUpdates = useMemo(() => {
    if (!currentAddonId || !transformedAddon) return new Map();
    return new Map([[currentAddonId, transformedAddon]]);
  }, [currentAddonId, transformedAddon]);

  // Track loading state for form open
  const isFormLoading = currentAddonId ? isLoadingAddon : false;

  const handleCreate = async (data: Partial<Addon>) => {
    if (!data.name || !data.type || data.basePrice === undefined) {
      throw new Error('Required fields: name, type, and basePrice');
    }
    const createRequest: CreateAddonRequest = {
      name: data.name,
      type: data.type,
      basePrice: typeof data.basePrice === 'string' ? parseFloat(data.basePrice) : data.basePrice,
      code: data.code,
      description: data.description,
      materialId: data.materialId === null ? undefined : data.materialId,
      isActive: data.isActive,
      rules: data.rules,
    };
    await createAddon(createRequest);
  };

  const handleUpdate = async (id: string | number, data: Partial<Addon>) => {
    const updateRequest: UpdateAddonRequest = {
      name: data.name,
      type: data.type,
      basePrice: data.basePrice !== undefined ? (typeof data.basePrice === 'string' ? parseFloat(data.basePrice) : data.basePrice) : undefined,
      code: data.code,
      description: data.description,
      materialId: data.materialId === null ? undefined : data.materialId,
      isActive: data.isActive,
      rules: data.rules,
    };
    await updateAddon({ id: Number(id), body: updateRequest });
  };

  const handleDelete = async (id: string | number) => {
    await deleteAddon(Number(id));
  };

  const handleFormOpen = (item: Addon) => {
    setCurrentAddonId(item.id);
  };

  const handleFormClose = () => {
    setCurrentAddonId(null);
  };


  return (
    <PermissionGuard permission="addons.view">
      <EntityManager
        entityName="Add-on"
        entityNamePlural="Add-ons"
        data={addons}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'addons.create',
          update: 'addons.update',
          delete: 'addons.delete',
          view: 'addons.view',
        }}
        isLoading={isLoading}
        isMutating={isFormLoading}
        error={errorMessage}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onFormOpen={handleFormOpen}
        onFormClose={handleFormClose}
        optimisticUpdates={optimisticUpdates}
        formWidth='50%'
      />
    </PermissionGuard>
  );
}
