import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { TagTypes } from './baseApi';

// Types
export interface StockTransferItem {
  id?: number;
  itemId: number;
  quantityTransferred: number;
  unitCost?: number;
  totalCost?: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface StockTransfer {
  id: number;
  transferNumber: string;
  sourceWarehouseId: number;
  sourceLocationId?: number;
  destinationWarehouseId: number;
  destinationLocationId?: number;
  transferDate: string;
  expectedDate?: string;
  status: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  notes?: string;
  items: StockTransferItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockTransferRequest {
  sourceWarehouseId: number;
  sourceLocationId?: number;
  destinationWarehouseId: number;
  destinationLocationId?: number;
  transferDate: string;
  expectedDate?: string;
  notes?: string;
  items: Omit<StockTransferItem, 'id'>[];
}

export interface UpdateStockTransferRequest {
  sourceWarehouseId?: number;
  sourceLocationId?: number;
  destinationWarehouseId?: number;
  destinationLocationId?: number;
  transferDate?: string;
  expectedDate?: string;
  notes?: string;
  items?: Omit<StockTransferItem, 'id'>[];
}

export interface StockTransferFilters {
  page?: number;
  limit?: number;
  transferNumber?: string;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  status?: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  transferDateFrom?: string;
  transferDateTo?: string;
  expectedDateFrom?: string;
  expectedDateTo?: string;
}

export interface ReceiveStockTransferRequest {
  notes?: string;
}

export const stockTransfersEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, Record<string, unknown>, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({
  getStockTransfers: builder.query<StockTransfer[], StockTransferFilters>({
    query: (params) => ({
      url: '/inv/stock-transfers',
      params,
    }),
    providesTags: ['StockTransfer'],
    extraOptions: {},
    transformResponse: (response: { items: StockTransfer[] }) => response.items,
  }),
  getStockTransfer: builder.query<StockTransfer, number>({
    query: (id) => ({
      url: `/inv/stock-transfers/${id}`,
    }),
    providesTags: (result, error, id) => [{ type: 'StockTransfer', id }],
    extraOptions: {},
  }),
  createStockTransfer: builder.mutation<StockTransfer, CreateStockTransferRequest>({
    query: (body) => ({
      url: '/inv/stock-transfers',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['StockTransfer'],
    extraOptions: {},
  }),
  updateStockTransfer: builder.mutation<StockTransfer, { id: number; body: UpdateStockTransferRequest }>({
    query: ({ id, body }) => ({
      url: `/inv/stock-transfers/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'StockTransfer', id }],
    extraOptions: {},
  }),
  approveStockTransfer: builder.mutation<StockTransfer, number>({
    query: (id) => ({
      url: `/inv/stock-transfers/${id}/approve`,
      method: 'PATCH',
    }),
    invalidatesTags: (result, error, id) => [{ type: 'StockTransfer', id }],
    extraOptions: {},
  }),
  shipStockTransfer: builder.mutation<StockTransfer, number>({
    query: (id) => ({
      url: `/inv/stock-transfers/${id}/ship`,
      method: 'PATCH',
    }),
    invalidatesTags: (result, error, id) => [{ type: 'StockTransfer', id }],
    extraOptions: {},
  }),
  receiveStockTransfer: builder.mutation<StockTransfer, { id: number; body?: ReceiveStockTransferRequest }>({
    query: ({ id, body }) => ({
      url: `/inv/stock-transfers/${id}/receive`,
      method: 'PATCH',
      body: body || {},
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'StockTransfer', id }],
    extraOptions: {},
  }),
  cancelStockTransfer: builder.mutation<StockTransfer, number>({
    query: (id) => ({
      url: `/inv/stock-transfers/${id}/cancel`,
      method: 'PATCH',
    }),
    invalidatesTags: (result, error, id) => [{ type: 'StockTransfer', id }],
    extraOptions: {},
  }),
  deleteStockTransfer: builder.mutation<void, number>({
    query: (id) => ({
      url: `/inv/stock-transfers/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['StockTransfer'],
    extraOptions: {},
  }),
});
