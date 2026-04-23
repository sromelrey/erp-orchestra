import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Shared tag types for all API endpoints.
 * Exported as const array to ensure consistency across all API slice files.
 */
export const TAG_TYPES = [
  'User',
  'Role',
  'Permission',
  'UserPermission',
  'Session',
  'Departments',
  'Designations',
  'Branches',
  'Employees',
  'Attendance',
  'LeaveTypes',
  'LeaveRequests',
  'PayPeriods',
  'Timesheets',
  'Compensation',
  'CompensationHistory',
  'Deductions',
  'Materials',
  'Warehouse',
  'WarehouseCapacity',
  'Location',
  'StockLedger',
  'ItemCategory',
  'ItemUom',
  'Item',
  'SalesOrders',
  'GoodsReceipt',
  'ProductionBatch',
  'Bom',
  'StockAdjustment',
  'StockTransfer',
  'GoodsIssuance',
  'ServiceType',
  'ServiceOption',
  'ServiceConfiguration',
  'Addon',
  'AddonRule',
] as const;

export type TagTypes = typeof TAG_TYPES[number];

/**
 * Shared base API for all features.
 * Consolidating to a single API slice allows for cross-feature tag invalidation
 * (e.g. rolesApi invalidating usersApi tags).
 */
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      // Logic for shared headers (e.g. auth tokens) can be added here
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: TAG_TYPES,
  endpoints: () => ({}), // Endpoints will be injected by feature-specific files
});
