import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { 
  Location, 
  LocationTreeNode,
  CreateLocationRequest, 
  LocationsQueryParams 
} from '@/types/operations';

export const locationsEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, 'User' | 'Role' | 'Permission' | 'UserPermission' | 'Session' | 'Departments' | 'Designations' | 'Branches' | 'Employees' | 'Attendance' | 'LeaveTypes' | 'LeaveRequests' | 'PayPeriods' | 'Timesheets' | 'Compensation' | 'CompensationHistory' | 'Deductions' | 'Materials' | 'Warehouse' | 'WarehouseCapacity' | 'Location' | 'StockLedger' | 'ItemCategory' | 'ItemUom' | 'Item', 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    getLocations: builder.query<Location[], LocationsQueryParams>({
      query: (params) => {
        const { warehouseId, ...rest } = params;
        return {
          url: `/ops/warehouses/${warehouseId}/locations`,
          params: rest,
        };
      },
      providesTags: ['Location'],
      extraOptions: {},
    }),
    getLocationTree: builder.query<LocationTreeNode[], string>({
      query: (warehouseId) => ({
        url: `/ops/warehouses/${warehouseId}/locations/tree`,
        params: { warehouseId },
      }),
      providesTags: ['Location'],
      extraOptions: {},
    }),
    createLocation: builder.mutation<Location, { warehouseId: string } & CreateLocationRequest>({
      query: ({ warehouseId, ...body }) => {
        if (!warehouseId) {
          throw new Error('warehouseId is required for creating location');
        }
        return {
          url: `/ops/warehouses/${warehouseId}/locations`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Location'],
      extraOptions: {},
    }),
    updateLocation: builder.mutation<Location, { id: string; warehouseId: string } & { body: Partial<CreateLocationRequest> }>({
      query: ({ id, warehouseId, body }) => {
        if (!warehouseId) {
          throw new Error('warehouseId is required for updating location');
        }
        return {
          url: `/ops/warehouses/${warehouseId}/locations/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Location', id }],
      extraOptions: {},
    }),
});

// Hooks will be exported from the main API index file
