'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns, ServiceType } from './column';
import { formFields } from './form-fields';
import {
  useGetServiceTypesQuery,
  useCreateServiceTypeMutation,
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
} from '@/store/api';
import { toast } from 'sonner';

export function ServiceTypesPage() {
  const { data: response, isLoading, error } = useGetServiceTypesQuery({});
  const serviceTypes = response?.data || [];

  const [createServiceType] = useCreateServiceTypeMutation();
  const [updateServiceType] = useUpdateServiceTypeMutation();
  const [deleteServiceType] = useDeleteServiceTypeMutation();


  // CRUD handlers for Service Types
  const handleCreateServiceType = async (data: Partial<ServiceType>) => {
    try {
      await createServiceType({
        code: data.code!,
        name: data.name!,
        description: data.description,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }).unwrap();
      toast.success('Service type created successfully');
    } catch {
      toast.error('Failed to create service type');
    }
  };

  const handleUpdateServiceType = async (id: string | number, data: Partial<ServiceType>) => {
    try {
      await updateServiceType({
        id: Number(id),
        body: {
          code: data.code,
          name: data.name,
          description: data.description,
          isActive: data.isActive,
        },
      }).unwrap();
      toast.success('Service type updated successfully');
    } catch {
      toast.error('Failed to update service type');
    }
  };

  const handleDeleteServiceType = async (id: string | number) => {
    try {
      await deleteServiceType(Number(id));
      toast.success('Service type deleted successfully');
    } catch {
      toast.error('Failed to delete service type');
    }
  };


  return (
    <PermissionGuard permission="service_config.service_type.view">
      <EntityManager
        entityName="Service Type"
        entityNamePlural="Service Types"
        data={serviceTypes}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service_config.service_type.create',
          update: 'service_config.service_type.update',
          delete: 'service_config.service_type.delete',
          view: 'service_config.service_type.view',
        }}
        isLoading={isLoading}
        error={error ? 'Failed to load services' : undefined}
        onCreate={handleCreateServiceType}
        onUpdate={handleUpdateServiceType}
        onDelete={handleDeleteServiceType}
        formWidth='50%'
      />
    </PermissionGuard>
  );
}

export default ServiceTypesPage;
