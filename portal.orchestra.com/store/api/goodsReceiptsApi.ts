import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { PaginatedResponse } from '@/types';

export enum GoodsReceiptStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum GoodsReceiptType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  PRODUCTION = 'PRODUCTION',
  RETURN = 'RETURN',
  MANUAL = 'MANUAL',
}

export interface GoodsReceiptItem {
  id: number;
  goodsReceiptId: number;
  itemId: number;
  uomId: number;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tenantId: number;
  // Nested objects from API
  item?: {
    id: number;
    code: string;
    name: string;
  };
  uom?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface GoodsReceipt {
  id: number;
  receiptNumber: string;
  receiptType: GoodsReceiptType;
  referenceType?: string;
  referenceCode?: string;
  supplierId?: number;
  warehouseId: number;
  locationId?: number;
  receiptDate: string;
  expectedDate?: string;
  status: GoodsReceiptStatus;
  notes?: string;
  totalQuantity: number;
  totalValue: number;
  confirmedBy?: number;
  confirmedAt?: string;
  cancelledBy?: number;
  cancelledAt?: string;
  createdBy?: number;
  updatedBy?: number;
  deletedBy?: number;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Nested objects from API
  items?: GoodsReceiptItem[];
  warehouse?: {
    id: number;
    code: string;
    name: string;
  };
  location?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateGoodsReceiptItemRequest {
  itemId: number;
  uomId: number;
  quantityOrdered: number;
  quantityReceived?: number;
  unitPrice?: number;
  totalPrice?: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface CreateGoodsReceiptRequest {
  receiptType: GoodsReceiptType;
  referenceType?: string;
  referenceCode?: string;
  supplierId?: number;
  warehouseId: number;
  locationId?: number;
  receiptDate?: string;
  expectedDate?: string;
  notes?: string;
  items: CreateGoodsReceiptItemRequest[];
}

export interface UpdateGoodsReceiptRequest {
  referenceType?: string;
  referenceCode?: string;
  supplierId?: number;
  warehouseId?: number;
  locationId?: number;
  receiptDate?: string;
  expectedDate?: string;
  notes?: string;
}

export interface ConfirmGoodsReceiptRequest {
  notes?: string;
}

export interface GoodsReceiptFilters {
  page?: number;
  limit?: number;
  status?: GoodsReceiptStatus;
  receiptType?: GoodsReceiptType;
  receiptNumber?: string;
  warehouseId?: number;
  supplierId?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const goodsReceiptsEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, 'User' | 'Role' | 'Permission' | 'UserPermission' | 'Session' | 'Departments' | 'Designations' | 'Branches' | 'Employees' | 'Attendance' | 'LeaveTypes' | 'LeaveRequests' | 'PayPeriods' | 'Timesheets' | 'Compensation' | 'CompensationHistory' | 'Deductions' | 'Materials' | 'Warehouse' | 'WarehouseCapacity' | 'Location' | 'StockLedger' | 'ItemCategory' | 'ItemUom' | 'Item' | 'SalesOrders' | 'GoodsReceipt', 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
  getGoodsReceipts: builder.query<PaginatedResponse<GoodsReceipt>, GoodsReceiptFilters>({
    query: (params: GoodsReceiptFilters) => ({
      url: '/ops/goods-receipt',
      params,
    }),
    transformResponse: (response: { items: GoodsReceipt[]; page: number; limit: number; total: number; totalPages: number }) => {
      return {
        data: response.items,
        meta: {
          nextCursor: response.page < response.totalPages ? response.page + 1 : null,
          total: response.total,
        },
      };
    },
    providesTags: (result: PaginatedResponse<GoodsReceipt> | undefined) =>
      result && result.data
        ? [
            ...result.data.map(({ id }) => ({
              type: 'GoodsReceipt' as const,
              id,
            })),
            { type: 'GoodsReceipt', id: 'LIST' },
          ]
        : [{ type: 'GoodsReceipt', id: 'LIST' }],
  }),
  getGoodsReceiptById: builder.query<GoodsReceipt, string | number>({
    query: (id: string | number) => `/ops/goods-receipt/${id}`,
    providesTags: (_result: GoodsReceipt | undefined, _error: unknown, id: string | number) => [
      { type: 'GoodsReceipt', id },
    ],
  }),
  getGoodsReceiptByNumber: builder.query<GoodsReceipt, string>({
    query: (receiptNumber: string) => `/ops/goods-receipt/number/${receiptNumber}`,
    providesTags: (_result: GoodsReceipt | undefined, _error: unknown, receiptNumber: string) => [
      { type: 'GoodsReceipt', id: `number-${receiptNumber}` },
    ],
  }),
  createGoodsReceipt: builder.mutation<GoodsReceipt, CreateGoodsReceiptRequest>({
    query: (body: CreateGoodsReceiptRequest) => ({
      url: '/ops/goods-receipt',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'GoodsReceipt', id: 'LIST' }],
  }),
  updateGoodsReceipt: builder.mutation<
    GoodsReceipt,
    { id: string | number; body: UpdateGoodsReceiptRequest }
  >({
    query: ({ id, body }: { id: string | number; body: UpdateGoodsReceiptRequest }) => ({
      url: `/ops/goods-receipt/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (
      result: GoodsReceipt | undefined,
      error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'GoodsReceipt', id },
      { type: 'GoodsReceipt', id: 'LIST' },
    ],
  }),
  deleteGoodsReceipt: builder.mutation<void, string | number>({
    query: (id: string | number) => ({
      url: `/ops/goods-receipt/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'GoodsReceipt', id: 'LIST' }],
  }),
  confirmGoodsReceipt: builder.mutation<GoodsReceipt, { id: string | number; body: ConfirmGoodsReceiptRequest }>({
    query: ({ id, body }: { id: string | number; body: ConfirmGoodsReceiptRequest }) => ({
      url: `/ops/goods-receipt/${id}/confirm`,
      method: 'POST',
      body,
    }),
    invalidatesTags: (
      result: GoodsReceipt | undefined,
      error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'GoodsReceipt', id },
      { type: 'GoodsReceipt', id: 'LIST' },
    ],
  }),
  cancelGoodsReceipt: builder.mutation<GoodsReceipt, string | number>({
    query: (id: string | number) => ({
      url: `/ops/goods-receipt/${id}/cancel`,
      method: 'POST',
    }),
    invalidatesTags: (
      result: GoodsReceipt | undefined,
      error: unknown,
      id: string | number
    ) => [
      { type: 'GoodsReceipt', id },
      { type: 'GoodsReceipt', id: 'LIST' },
    ],
  }),
});

// Hooks will be exported from the main API index file
