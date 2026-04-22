'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';
import {
  useGetServiceConfigurationsQuery,
  useGetServiceTypesQuery,
  useGetServiceOptionsQuery,
  useCreateServiceConfigurationMutation,
  useUpdateServiceConfigurationMutation,
  useDeleteServiceConfigurationMutation,
} from '@/store/api';
import { toast } from 'sonner';
import { useMemo } from 'react';

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

export function ServiceConfigurationsPage() {
  const { data: response, isLoading, error } = useGetServiceConfigurationsQuery({}) as QueryResult<{
    id: number;
    serviceTypeId: number;
    serviceOptionId: number;
    price: number;
    conditionKey?: string;
    conditionValue?: string;
    bomId?: number;
    isActive: boolean;
    tenantId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  const serviceConfigurations = response?.data || [];
  const { data: serviceTypesResponse } = useGetServiceTypesQuery({}) as QueryResult<{
    id: number;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  const { data: serviceOptionsResponse } = useGetServiceOptionsQuery({}) as QueryResult<{
    id: number;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: number;
    createdAt: string;
    updatedAt: string;
  }>;

  // Prepare options for dropdowns
  const serviceTypeOptions = useMemo(() => {
    const serviceTypes = serviceTypesResponse?.data || [];
    return serviceTypes.map((type: { id: number; code: string; name: string }) => ({
      value: type.id,
      label: `${type.code} - ${type.name}`,
    }));
  }, [serviceTypesResponse?.data]);

  const serviceOptionOptions = useMemo(() => {
    const serviceOptions = serviceOptionsResponse?.data || [];
    return serviceOptions.map((option: { id: number; code: string; name: string }) => ({
      value: option.id,
      label: `${option.code} - ${option.name}`,
    }));
  }, [serviceOptionsResponse?.data]);

  const [createServiceConfiguration] = useCreateServiceConfigurationMutation();
  const [updateServiceConfiguration] = useUpdateServiceConfigurationMutation();
  const [deleteServiceConfiguration] = useDeleteServiceConfigurationMutation();

  // CRUD handlers for Service Configurations
  const handleCreateServiceConfiguration = async (data: Partial<{
    serviceTypeId: number;
    serviceOptionId: number;
    price: number;
    conditionKey?: string;
    conditionValue?: string;
    bomId?: number;
    isActive: boolean;
  }>) => {
    try {
      // Validate required fields
      if (data.serviceTypeId === undefined || data.serviceOptionId === undefined || data.price === undefined) {
        toast.error('Please fill in all required fields');
        return;
      }

      await createServiceConfiguration({
        serviceTypeId: data.serviceTypeId,
        serviceOptionId: data.serviceOptionId,
        price: data.price,
        conditionKey: data.conditionKey,
        conditionValue: data.conditionValue,
        bomId: data.bomId,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }).unwrap();
      toast.success('Service configuration created successfully');
    } catch {
      toast.error('Failed to create service configuration');
    }
  };

  const handleUpdateServiceConfiguration = async (id: string | number, data: Partial<{
    serviceTypeId: number;
    serviceOptionId: number;
    price: number;
    conditionKey?: string;
    conditionValue?: string;
    bomId?: number;
    isActive: boolean;
  }>) => {
    try {
      // Only include fields that are provided in the update
      const updateBody: {
        serviceTypeId?: number;
        serviceOptionId?: number;
        price?: number;
        conditionKey?: string;
        conditionValue?: string;
        bomId?: number;
        isActive?: boolean;
      } = {
        conditionKey: data.conditionKey,
        conditionValue: data.conditionValue,
        bomId: data.bomId,
        isActive: data.isActive,
      };

      // Add required fields only if they're being updated
      if (data.serviceTypeId !== undefined) updateBody.serviceTypeId = data.serviceTypeId;
      if (data.serviceOptionId !== undefined) updateBody.serviceOptionId = data.serviceOptionId;
      if (data.price !== undefined) updateBody.price = data.price;

      await updateServiceConfiguration({
        id: Number(id),
        body: updateBody,
      }).unwrap();
      toast.success('Service configuration updated successfully');
    } catch {
      toast.error('Failed to update service configuration');
    }
  };

  const handleDeleteServiceConfiguration = async (id: string | number) => {
    try {
      await deleteServiceConfiguration(Number(id));
      toast.success('Service configuration deleted successfully');
    } catch {
      toast.error('Failed to delete service configuration');
    }
  };

  // Get dynamic form fields with options
  const dynamicFormFields = useMemo(() => {
    const fields = [...formFields];
    
    // Update service type dropdown options
    const serviceTypeField = fields.find(f => f.name === 'serviceTypeId');
    if (serviceTypeField && serviceTypeField.type === 'select') {
      serviceTypeField.options = serviceTypeOptions;
    }

    // Update service option dropdown options
    const serviceOptionField = fields.find(f => f.name === 'serviceOptionId');
    if (serviceOptionField && serviceOptionField.type === 'select') {
      serviceOptionField.options = serviceOptionOptions;
    }

    return fields;
  }, [serviceTypeOptions, serviceOptionOptions]);

  return (
    <PermissionGuard permission="service_config.service_configuration.view">
      <EntityManager
        entityName="Service Configuration"
        entityNamePlural="Service Configurations"
        data={serviceConfigurations}
        columns={columns}
        formFields={dynamicFormFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service_config.service_configuration.create',
          update: 'service_config.service_configuration.update',
          delete: 'service_config.service_configuration.delete',
          view: 'service_config.service_configuration.view',
        }}
        isLoading={isLoading}
        error={error ? 'Failed to load service configurations' : undefined}
        onCreate={handleCreateServiceConfiguration}
        onUpdate={handleUpdateServiceConfiguration}
        onDelete={handleDeleteServiceConfiguration}
        formWidth='50%'
      />
    </PermissionGuard>
  );
}

export default ServiceConfigurationsPage;
