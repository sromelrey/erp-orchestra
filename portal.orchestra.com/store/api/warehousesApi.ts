import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { 
  Warehouse, 
  CreateWarehouseRequest, 
  UpdateWarehouseRequest, 
  WarehousesQueryParams,
  CapacityInfo 
} from '@/types/operations';

export const warehousesEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, 'User' | 'Role' | 'Permission' | 'UserPermission' | 'Session' | 'Departments' | 'Designations' | 'Branches' | 'Employees' | 'Attendance' | 'LeaveTypes' | 'LeaveRequests' | 'PayPeriods' | 'Timesheets' | 'Compensation' | 'CompensationHistory' | 'Deductions' | 'Materials' | 'Warehouse' | 'WarehouseCapacity' | 'Location' | 'StockLedger' | 'ItemCategory' | 'ItemUom' | 'Item', 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    getWarehouses: builder.query<Warehouse[], WarehousesQueryParams>({
      query: (params) => ({
        url: '/ops/warehouses',
        params,
      }),
      providesTags: ['Warehouse'],
    }),
    getWarehouse: builder.query<Warehouse, string>({
      query: (id) => `/ops/warehouses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Warehouse', id }],
    }),
    createWarehouse: builder.mutation<Warehouse, CreateWarehouseRequest>({
      query: (body) => ({
        url: '/ops/warehouses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    updateWarehouse: builder.mutation<Warehouse, UpdateWarehouseRequest>({
      query: ({ id, ...body }) => ({
        url: `/ops/warehouses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Warehouse', id }],
    }),
    deleteWarehouse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ops/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Warehouse', id }],
    }),
    getWarehouseCapacity: builder.query<CapacityInfo, string>({
      query: (id) => `/ops/warehouses/${id}/capacity`,
      providesTags: (result, error, id) => [{ type: 'WarehouseCapacity' as const, id }],
    }),
});

// Hooks will be exported from the main API index file
