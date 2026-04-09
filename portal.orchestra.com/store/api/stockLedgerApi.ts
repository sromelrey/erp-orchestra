import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { 
  StockLedgerEntry,
  CreateStockMovementRequest,
  StockLedgerQueryParams 
} from '@/types/operations';

export const stockLedgerEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, 'User' | 'Role' | 'Permission' | 'UserPermission' | 'Session' | 'Departments' | 'Designations' | 'Branches' | 'Employees' | 'Attendance' | 'LeaveTypes' | 'LeaveRequests' | 'PayPeriods' | 'Timesheets' | 'Compensation' | 'CompensationHistory' | 'Deductions' | 'Materials' | 'Warehouse' | 'WarehouseCapacity' | 'Location' | 'StockLedger' | 'ItemCategory' | 'ItemUom' | 'Item', 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    getStockLedger: builder.query<StockLedgerEntry[], StockLedgerQueryParams>({
      query: (params) => ({
        url: '/ops/stock-ledger',
        params,
      }),
      providesTags: ['StockLedger'],
      extraOptions: {},
    }),
    recordStockMovement: builder.mutation<StockLedgerEntry, CreateStockMovementRequest>({
      query: (body) => ({
        url: '/ops/stock-ledger',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StockLedger'],
      extraOptions: {},
    }),
});

// Hooks will be exported from the main API index file
