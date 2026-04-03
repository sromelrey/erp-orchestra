import { baseApi } from './baseApi';
import { warehousesEndpoints } from './warehousesApi';
import { locationsEndpoints } from './locationsApi';
import { usersEndpoints } from './usersApi';
import { stockLedgerEndpoints } from './stockLedgerApi';
import { itemsEndpoints } from './itemsApi';

// Inject the feature-specific endpoints
export const api = baseApi
  .injectEndpoints({ endpoints: warehousesEndpoints })
  .injectEndpoints({ endpoints: locationsEndpoints })
  .injectEndpoints({ endpoints: usersEndpoints })
  .injectEndpoints({ endpoints: stockLedgerEndpoints })
  .injectEndpoints({ endpoints: itemsEndpoints });

// Export hooks for each API
export const warehousesHooks = api.endpoints;
export const locationsHooks = api.endpoints;
export const usersHooks = api.endpoints;

// Export individual hooks
export const useGetWarehousesQuery = api.useGetWarehousesQuery;
export const useGetWarehouseQuery = api.useGetWarehouseQuery;
export const useCreateWarehouseMutation = api.useCreateWarehouseMutation;
export const useUpdateWarehouseMutation = api.useUpdateWarehouseMutation;
export const useDeleteWarehouseMutation = api.useDeleteWarehouseMutation;
export const useGetWarehouseCapacityQuery = api.useGetWarehouseCapacityQuery;

export const useGetLocationsQuery = api.useGetLocationsQuery;
export const useGetLocationTreeQuery = api.useGetLocationTreeQuery;
export const useCreateLocationMutation = api.useCreateLocationMutation;
export const useUpdateLocationMutation = api.useUpdateLocationMutation;

export const useGetUsersQuery = api.useGetUsersQuery;
export const useGetUserQuery = api.useGetUserQuery;
export const useCreateUserMutation = api.useCreateUserMutation;
export const useUpdateUserMutation = api.useUpdateUserMutation;
export const useDeleteUserMutation = api.useDeleteUserMutation;
export const useGetUserPermissionsQuery = api.useGetUserPermissionsQuery;
export const useGetEffectivePermissionsQuery = api.useGetEffectivePermissionsQuery;
export const useAssignUserPermissionsMutation = api.useAssignUserPermissionsMutation;
export const useRemoveUserPermissionsMutation = api.useRemoveUserPermissionsMutation;

// Stock Ledger hooks
export const useGetStockLedgerQuery = api.useGetStockLedgerQuery;
export const useRecordStockMovementMutation = api.useRecordStockMovementMutation;

// Items hooks
export const useGetItemsQuery = api.useGetItemsQuery;
export const useCreateItemMutation = api.useCreateItemMutation;
export const useUpdateItemMutation = api.useUpdateItemMutation;
export const useGetItemCategoriesQuery = api.useGetItemCategoriesQuery;
export const useCreateItemCategoryMutation = api.useCreateItemCategoryMutation;
export const useGetItemUomsQuery = api.useGetItemUomsQuery;
export const useCreateItemUomMutation = api.useCreateItemUomMutation;

// Re-export other APIs as needed
export { materialsApi } from './materialsApi';
export { authApi } from './authApi';
export { attendanceApi } from './attendanceApi';
export { branchesApi } from './branchesApi';
export { compensationApi } from './compensationApi';
export { departmentsApi } from './departmentsApi';
export { designationsApi } from './designationsApi';
export { employeesApi } from './employeesApi';
export { leaveApi } from './leaveApi';
export { payPeriodsApi } from './payPeriodsApi';
export { rolesApi } from './rolesApi';
export { sessionsApi } from './sessionsApi';
export { timesheetsApi } from './timesheetsApi';
