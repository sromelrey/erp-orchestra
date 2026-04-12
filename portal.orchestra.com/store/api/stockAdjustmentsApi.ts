import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { TagTypes } from './baseApi';

// Types
export interface StockAdjustmentItem {
  id?: number;
  itemId: number;
  quantityAdjusted: number;
  unitCost?: number;
  totalCost?: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface StockAdjustment {
  id: number;
  adjustmentNumber: string;
  adjustmentType: 'DAMAGE' | 'LOSS' | 'FOUND' | 'COUNT';
  warehouseId: number;
  locationId?: number;
  referenceType?: string;
  referenceId?: number;
  adjustmentDate: string;
  status: 'DRAFT' | 'APPROVED' | 'CANCELLED';
  notes?: string;
  items: StockAdjustmentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockAdjustmentRequest {
  adjustmentType: 'DAMAGE' | 'LOSS' | 'FOUND' | 'COUNT';
  warehouseId: number;
  locationId?: number;
  referenceType?: string;
  referenceId?: number;
  adjustmentDate: string;
  notes?: string;
  items: Omit<StockAdjustmentItem, 'id'>[];
}

export interface UpdateStockAdjustmentRequest {
  adjustmentType?: 'DAMAGE' | 'LOSS' | 'FOUND' | 'COUNT';
  warehouseId?: number;
  locationId?: number;
  referenceType?: string;
  referenceId?: number;
  adjustmentDate?: string;
  notes?: string;
  items?: Omit<StockAdjustmentItem, 'id'>[];
}

export interface StockAdjustmentFilters {
  page?: number;
  limit?: number;
  adjustmentNumber?: string;
  adjustmentType?: 'DAMAGE' | 'LOSS' | 'FOUND' | 'COUNT';
  warehouseId?: number;
  locationId?: number;
  status?: 'DRAFT' | 'APPROVED' | 'CANCELLED';
  adjustmentDateFrom?: string;
  adjustmentDateTo?: string;
  referenceType?: string;
  referenceId?: number;
}

export interface ApproveStockAdjustmentRequest {
  notes?: string;
}

export const stockAdjustmentsEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, Record<string, unknown>, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({
  getStockAdjustments: builder.query<StockAdjustment[], StockAdjustmentFilters>({
    query: (params) => ({
      url: '/inv/stock-adjustments',
      params,
    }),
    providesTags: ['StockAdjustment'],
    extraOptions: {},
    transformResponse: (response: { items: StockAdjustment[] }) => response.items,
  }),
  getStockAdjustment: builder.query<StockAdjustment, number>({
    query: (id) => ({
      url: `/inv/stock-adjustments/${id}`,
    }),
    providesTags: (result, error, id) => [{ type: 'StockAdjustment', id }],
    extraOptions: {},
  }),
  createStockAdjustment: builder.mutation<StockAdjustment, CreateStockAdjustmentRequest>({
    query: (body) => ({
      url: '/inv/stock-adjustments',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['StockAdjustment'],
    extraOptions: {},
  }),
  updateStockAdjustment: builder.mutation<StockAdjustment, { id: number; body: UpdateStockAdjustmentRequest }>({
    query: ({ id, body }) => ({
      url: `/inv/stock-adjustments/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'StockAdjustment', id }],
    extraOptions: {},
  }),
  approveStockAdjustment: builder.mutation<StockAdjustment, { id: number; body?: ApproveStockAdjustmentRequest }>({
    query: ({ id, body }) => ({
      url: `/inv/stock-adjustments/${id}/approve`,
      method: 'PATCH',
      body: body || {},
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'StockAdjustment', id }],
    extraOptions: {},
  }),
  cancelStockAdjustment: builder.mutation<StockAdjustment, number>({
    query: (id) => ({
      url: `/inv/stock-adjustments/${id}/cancel`,
      method: 'PATCH',
    }),
    invalidatesTags: (result, error, id) => [{ type: 'StockAdjustment', id }],
    extraOptions: {},
  }),
  deleteStockAdjustment: builder.mutation<void, number>({
    query: (id) => ({
      url: `/inv/stock-adjustments/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['StockAdjustment'],
    extraOptions: {},
  }),
});
