import { baseApi } from './baseApi';
import { warehousesEndpoints } from './warehousesApi';
import { locationsEndpoints } from './locationsApi';
import { usersEndpoints } from './usersApi';
import { stockLedgerEndpoints } from './stockLedgerApi';
import { itemsEndpoints } from './itemsApi';
import { salesOrdersEndpoints } from './salesOrdersApi';
import { goodsReceiptsEndpoints } from './goodsReceiptsApi';
import { productionEndpoints } from './productionApi';
import { stockAdjustmentsEndpoints } from './stockAdjustmentsApi';
import { stockTransfersEndpoints } from './stockTransfersApi';
import { goodsIssuanceEndpoints } from './goodsIssuanceApi';
import { departmentsApi, useGetDepartmentsQuery, useCreateDepartmentMutation, useGetDepartmentByIdQuery, useUpdateDepartmentMutation } from './departmentsApi';

// Inject the feature-specific endpoints
export const api = baseApi
  .injectEndpoints({ endpoints: warehousesEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: locationsEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: usersEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: stockLedgerEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: itemsEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: goodsReceiptsEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: salesOrdersEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: productionEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: stockAdjustmentsEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: stockTransfersEndpoints, overrideExisting: true })
  .injectEndpoints({ endpoints: goodsIssuanceEndpoints, overrideExisting: true })
  
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

// Export departments hooks
export { useGetDepartmentsQuery, useCreateDepartmentMutation, useGetDepartmentByIdQuery, useUpdateDepartmentMutation };

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

// Sales Orders hooks
export const useGetSalesOrdersQuery = api.useGetSalesOrdersQuery;
export const useGetSalesOrderByIdQuery = api.useGetSalesOrderByIdQuery;
export const useCreateSalesOrderMutation = api.useCreateSalesOrderMutation;
export const useUpdateSalesOrderMutation = api.useUpdateSalesOrderMutation;
export const useDeleteSalesOrderMutation = api.useDeleteSalesOrderMutation;
export const useConfirmSalesOrderMutation = api.useConfirmSalesOrderMutation;
export const useShipSalesOrderMutation = api.useShipSalesOrderMutation;
export const useDeliverSalesOrderMutation = api.useDeliverSalesOrderMutation;
export const useCancelSalesOrderMutation = api.useCancelSalesOrderMutation;

// Goods Receipt hooks
export const useGetGoodsReceiptsQuery = api.useGetGoodsReceiptsQuery;
export const useGetGoodsReceiptByIdQuery = api.useGetGoodsReceiptByIdQuery;
export const useGetGoodsReceiptByNumberQuery = api.useGetGoodsReceiptByNumberQuery;
export const useCreateGoodsReceiptMutation = api.useCreateGoodsReceiptMutation;
export const useUpdateGoodsReceiptMutation = api.useUpdateGoodsReceiptMutation;
export const useDeleteGoodsReceiptMutation = api.useDeleteGoodsReceiptMutation;
export const useConfirmGoodsReceiptMutation = api.useConfirmGoodsReceiptMutation;
export const useCancelGoodsReceiptMutation = api.useCancelGoodsReceiptMutation;

// Production Batch hooks
export const useGetBomsQuery = api.useGetBomsQuery;
export const useGetProductionBatchesQuery = api.useGetProductionBatchesQuery;
export const useGetProductionBatchByIdQuery = api.useGetProductionBatchByIdQuery;
export const useCreateProductionBatchMutation = api.useCreateProductionBatchMutation;
export const useUpdateProductionBatchMutation = api.useUpdateProductionBatchMutation;
export const useDeleteProductionBatchMutation = api.useDeleteProductionBatchMutation;
export const useStartProductionBatchMutation = api.useStartProductionBatchMutation;
export const useCompleteProductionBatchMutation = api.useCompleteProductionBatchMutation;
export const useCancelProductionBatchMutation = api.useCancelProductionBatchMutation;

// Stock Adjustments hooks
export const useGetStockAdjustmentsQuery = api.useGetStockAdjustmentsQuery;
export const useGetStockAdjustmentQuery = api.useGetStockAdjustmentQuery;
export const useCreateStockAdjustmentMutation = api.useCreateStockAdjustmentMutation;
export const useUpdateStockAdjustmentMutation = api.useUpdateStockAdjustmentMutation;
export const useApproveStockAdjustmentMutation = api.useApproveStockAdjustmentMutation;
export const useCancelStockAdjustmentMutation = api.useCancelStockAdjustmentMutation;
export const useDeleteStockAdjustmentMutation = api.useDeleteStockAdjustmentMutation;

// Stock Transfers hooks
export const useGetStockTransfersQuery = api.useGetStockTransfersQuery;
export const useGetStockTransferQuery = api.useGetStockTransferQuery;
export const useCreateStockTransferMutation = api.useCreateStockTransferMutation;
export const useUpdateStockTransferMutation = api.useUpdateStockTransferMutation;
export const useApproveStockTransferMutation = api.useApproveStockTransferMutation;
export const useShipStockTransferMutation = api.useShipStockTransferMutation;
export const useReceiveStockTransferMutation = api.useReceiveStockTransferMutation;
export const useCancelStockTransferMutation = api.useCancelStockTransferMutation;
export const useDeleteStockTransferMutation = api.useDeleteStockTransferMutation;

// Goods Issuance hooks
export const useGetGoodsIssuancesQuery = api.useGetGoodsIssuancesQuery;
export const useGetGoodsIssuanceQuery = api.useGetGoodsIssuanceQuery;
export const useGetGoodsIssuanceByNumberQuery = api.useGetGoodsIssuanceByNumberQuery;
export const useCreateGoodsIssuanceMutation = api.useCreateGoodsIssuanceMutation;
export const useUpdateGoodsIssuanceMutation = api.useUpdateGoodsIssuanceMutation;
export const useApproveGoodsIssuanceMutation = api.useApproveGoodsIssuanceMutation;
export const useCancelGoodsIssuanceMutation = api.useCancelGoodsIssuanceMutation;
export const useDeleteGoodsIssuanceMutation = api.useDeleteGoodsIssuanceMutation;

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
