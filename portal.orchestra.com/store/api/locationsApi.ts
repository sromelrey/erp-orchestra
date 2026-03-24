import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { 
  Location, 
  LocationTreeNode,
  CreateLocationRequest, 
  UpdateLocationRequest, 
  LocationsQueryParams 
} from '@/types/operations';

export const locationsEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, 'User' | 'Role' | 'Permission' | 'UserPermission' | 'Session' | 'Departments' | 'Designations' | 'Branches' | 'Employees' | 'Attendance' | 'LeaveTypes' | 'LeaveRequests' | 'PayPeriods' | 'Timesheets' | 'Compensation' | 'CompensationHistory' | 'Deductions' | 'Materials' | 'Warehouse' | 'WarehouseCapacity' | 'Location' | 'StockLedger', 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    getLocations: builder.query<Location[], LocationsQueryParams>({
      query: (params) => {
        const { warehouseId, ...rest } = params;
        if (!warehouseId) {
          // Return a dummy request that will return empty data
          return {
            url: '/ops/locations/empty',
            params: rest,
          };
        }
        return {
          url: `/ops/warehouses/${warehouseId}/locations`,
          params: rest,
        };
      },
      transformResponse: (response: Location[] | unknown, meta: unknown, arg: LocationsQueryParams | undefined) => {
        // Return empty array if no warehouseId
        if (!arg?.warehouseId) return [];
        return (response as Location[]) || [];
      },
      providesTags: ['Location'],
      extraOptions: {
        // Handle 404 errors gracefully when warehouseId is not provided
        validateStatus: (response: { status: number; ok: boolean }) => {
          if (response.status === 404) {
            // Return empty data for missing warehouse
            return true;
          }
          return response.ok;
        },
      },
    }),
    getLocationTree: builder.query<LocationTreeNode[], string | undefined>({
      query: (warehouseId) => {
        if (!warehouseId) {
          // Return a dummy request that will return empty data
          return {
            url: '/ops/locations/tree/empty',
          };
        }
        return {
          url: `/ops/warehouses/${warehouseId}/locations/tree`,
          params: { warehouseId },
        };
      },
      transformResponse: (response: LocationTreeNode[] | unknown, meta: unknown, arg: string | undefined) => {
        // Return empty array if no warehouseId
        if (!arg) return [];
        return (response as LocationTreeNode[]) || [];
      },
      providesTags: ['Location'],
      extraOptions: {
        // Handle 404 errors gracefully when warehouseId is not provided
        validateStatus: (response: { status: number; ok: boolean }) => {
          if (response.status === 404) {
            // Return empty data for missing warehouse
            return true;
          }
          return response.ok;
        },
      },
    }),
    createLocation: builder.mutation<Location, CreateLocationRequest>({
      query: (body) => {
        if (!body.warehouseId) {
          throw new Error('warehouseId is required for creating location');
        }
        return {
          url: `/ops/warehouses/${body.warehouseId}/locations`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Location'],
      extraOptions: {},
    }),
    updateLocation: builder.mutation<Location, UpdateLocationRequest>({
      query: ({ id, warehouseId, ...body }) => {
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
