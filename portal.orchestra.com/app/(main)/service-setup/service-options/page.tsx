'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';
import {
  useGetServiceOptionsQuery,
  useCreateServiceOptionMutation,
  useUpdateServiceOptionMutation,
  useDeleteServiceOptionMutation,
} from '@/store/api';
import { toast } from 'sonner';

// Type for paginated API response
type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Type for the query hook return value
type QueryResult<T> = {
  data?: PaginatedResponse<T>;
  isLoading: boolean;
  error?: unknown;
  isFetching?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
};

export function ServiceOptionsPage() {
  const { data: response, isLoading, error } = useGetServiceOptionsQuery({}) as QueryResult<{
    id: number;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  const serviceOptions = response?.data || [];

  const [createServiceOption] = useCreateServiceOptionMutation();
  const [updateServiceOption] = useUpdateServiceOptionMutation();
  const [deleteServiceOption] = useDeleteServiceOptionMutation();

  // CRUD handlers for Service Options
  const handleCreateServiceOption = async (data: Partial<{ code: string; name: string; description?: string; isActive: boolean }>) => {
    try {
      await createServiceOption({
        code: data.code!,
        name: data.name!,
        description: data.description,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }).unwrap();
      toast.success('Service option created successfully');
    } catch {
      toast.error('Failed to create service option');
    }
  };

  const handleUpdateServiceOption = async (id: string | number, data: Partial<{ code: string; name: string; description?: string; isActive: boolean }>) => {
    try {
      await updateServiceOption({
        id: Number(id),
        body: {
          code: data.code,
          name: data.name,
          description: data.description,
          isActive: data.isActive,
        },
      }).unwrap();
      toast.success('Service option updated successfully');
    } catch {
      toast.error('Failed to update service option');
    }
  };

  const handleDeleteServiceOption = async (id: string | number) => {
    try {
      await deleteServiceOption(Number(id));
      toast.success('Service option deleted successfully');
    } catch {
      toast.error('Failed to delete service option');
    }
  };

  return (
    <PermissionGuard permission="service_config.service_option.view">
      <EntityManager
        entityName="Service Option"
        entityNamePlural="Service Options"
        data={serviceOptions}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service_config.service_option.create',
          update: 'service_config.service_option.update',
          delete: 'service_config.service_option.delete',
          view: 'service_config.service_option.view',
        }}
        isLoading={isLoading}
        error={error ? 'Failed to load service options' : undefined}
        onCreate={handleCreateServiceOption}
        onUpdate={handleUpdateServiceOption}
        onDelete={handleDeleteServiceOption}
        formWidth='50%'
      />
    </PermissionGuard>
  );
}

export default ServiceOptionsPage;
