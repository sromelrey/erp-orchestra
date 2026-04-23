import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { TagTypes } from './baseApi';

interface ServiceType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceOption {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceConfiguration {
  id: number;
  serviceTypeId: number;
  serviceOptionId: number;
  conditionKey?: string;
  conditionValue?: string;
  bomId?: number;
  price: number;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  serviceType?: { name: string };
  serviceOption?: { name: string };
}

interface ServicePriceResponse {
  price: number;
  serviceTypeName: string;
  serviceOptionName: string;
}

interface CreateServiceTypeRequest {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

interface UpdateServiceTypeRequest {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

interface CreateServiceOptionRequest {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

interface UpdateServiceOptionRequest {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

interface CreateServiceConfigurationRequest {
  serviceTypeId: number;
  serviceOptionId: number;
  conditionKey?: string;
  conditionValue?: string;
  bomId?: number;
  price: number;
  isActive?: boolean;
}

interface UpdateServiceConfigurationRequest {
  serviceTypeId?: number;
  serviceOptionId?: number;
  conditionKey?: string;
  conditionValue?: string;
  bomId?: number;
  price?: number;
  isActive?: boolean;
}

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  [key: string]: unknown;
}

export const serviceConfigEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    // Service Types
    getServiceTypes: builder.query<ServiceType[], QueryParams>({
      query: (params) => ({
        url: '/service-config/service-types',
        method: 'GET',
        params,
      }),
      providesTags: ['ServiceType'],
    }),
    getServiceTypeById: builder.query<ServiceType, number>({
      query: (id) => `/service-config/service-types/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ServiceType', id }],
    }),
    createServiceType: builder.mutation<ServiceType, CreateServiceTypeRequest>({
      query: (body) => ({
        url: '/service-config/service-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceType'],
    }),
    updateServiceType: builder.mutation<ServiceType, { id: number; body: UpdateServiceTypeRequest }>({
      query: ({ id, body }) => ({
        url: `/service-config/service-types/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'ServiceType', id }],
    }),
    deleteServiceType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/service-config/service-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceType'],
    }),

    // Service Options
    getServiceOptions: builder.query<ServiceOption[], QueryParams>({
      query: (params) => ({
        url: '/service-config/service-options',
        method: 'GET',
        params,
      }),
      providesTags: ['ServiceOption'],
    }),
    getServiceOptionById: builder.query<ServiceOption, number>({
      query: (id) => `/service-config/service-options/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ServiceOption', id }],
    }),
    createServiceOption: builder.mutation<ServiceOption, CreateServiceOptionRequest>({
      query: (body) => ({
        url: '/service-config/service-options',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceOption'],
    }),
    updateServiceOption: builder.mutation<ServiceOption, { id: number; body: UpdateServiceOptionRequest }>({
      query: ({ id, body }) => ({
        url: `/service-config/service-options/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'ServiceOption', id }],
    }),
    deleteServiceOption: builder.mutation<void, number>({
      query: (id) => ({
        url: `/service-config/service-options/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceOption'],
    }),

    // Service Configurations
    getServiceConfigurations: builder.query<ServiceConfiguration[], QueryParams>({
      query: (params) => ({
        url: '/service-config/service-configurations',
        method: 'GET',
        params,
      }),
      providesTags: ['ServiceConfiguration'],
    }),
    getServiceConfigurationById: builder.query<ServiceConfiguration, number>({
      query: (id) => `/service-config/service-configurations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ServiceConfiguration', id }],
    }),
    createServiceConfiguration: builder.mutation<ServiceConfiguration, CreateServiceConfigurationRequest>({
      query: (body) => ({
        url: '/service-config/service-configurations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceConfiguration'],
    }),
    updateServiceConfiguration: builder.mutation<ServiceConfiguration, { id: number; body: UpdateServiceConfigurationRequest }>({
      query: ({ id, body }) => ({
        url: `/service-config/service-configurations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ServiceConfiguration', id },
      ],
    }),
    deleteServiceConfiguration: builder.mutation<void, number>({
      query: (id) => ({
        url: `/service-config/service-configurations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceConfiguration'],
    }),

    // Service Configuration Price Lookup
    getServicePrice: builder.query<ServicePriceResponse, { serviceTypeId: number; serviceOptionId: number }>({
      query: ({ serviceTypeId, serviceOptionId }) => ({
        url: '/service-config/service-configurations/price',
        method: 'GET',
        params: { service_type_id: serviceTypeId, service_option_id: serviceOptionId },
      }),
    }),
  });

// Hooks will be exported from the main API index file
