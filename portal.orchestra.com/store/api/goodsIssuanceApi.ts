import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { TagTypes } from './baseApi';
import { PaginatedResponse } from '@/types';

// Types
export interface GoodsIssuanceItem {
  id?: number;
  itemId: number;
  uomId: number;
  quantityIssued: number;
  unitPrice?: number;
  totalPrice?: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface GoodsIssuance {
  id: number;
  issuanceNumber: string;
  issuanceType: 'PRODUCTION' | 'SALES' | 'TRANSFER' | 'ADJUSTMENT';
  referenceType?: string;
  referenceCode?: string;
  issuedToDepartmentId?: number;
  warehouseId: number;
  locationId?: number;
  issuanceDate: string;
  expectedDate?: string;
  status: 'DRAFT' | 'APPROVED' | 'CANCELLED';
  notes?: string;
  items: GoodsIssuanceItem[];
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown; // Index signature for workflow compatibility
}

export interface CreateGoodsIssuanceRequest {
  issuanceType: 'PRODUCTION' | 'SALES' | 'TRANSFER' | 'ADJUSTMENT';
  referenceType?: string;
  referenceCode?: string;
  issuedToDepartmentId?: number;
  warehouseId: number;
  locationId?: number;
  issuanceDate: string;
  expectedDate?: string;
  notes?: string;
  items: Omit<GoodsIssuanceItem, 'id'>[];
}

export interface UpdateGoodsIssuanceRequest {
  issuanceType?: 'PRODUCTION' | 'SALES' | 'TRANSFER' | 'ADJUSTMENT';
  referenceType?: string;
  referenceCode?: string;
  issuedToDepartmentId?: number;
  warehouseId?: number;
  locationId?: number;
  issuanceDate?: string;
  expectedDate?: string;
  notes?: string;
  items?: Omit<GoodsIssuanceItem, 'id'>[];
}

export interface GoodsIssuanceFilters {
  page?: number;
  limit?: number;
  issuanceNumber?: string;
  issuanceType?: 'PRODUCTION' | 'SALES' | 'TRANSFER' | 'ADJUSTMENT';
  status?: 'DRAFT' | 'APPROVED' | 'CANCELLED';
  warehouseId?: number;
  issuanceDateFrom?: string;
  issuanceDateTo?: string;
}

export interface ApproveGoodsIssuanceRequest {
  notes?: string;
}

export const goodsIssuanceEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, Record<string, unknown>, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({
  getGoodsIssuances: builder.query<PaginatedResponse<GoodsIssuance>, GoodsIssuanceFilters>({
    query: (params) => ({
      url: '/ops/goods-issuance',
      params,
    }),
    providesTags: ['GoodsIssuance'],
    extraOptions: {},
  }),
  getGoodsIssuance: builder.query<GoodsIssuance, number>({
    query: (id) => ({
      url: `/ops/goods-issuance/${id}`,
    }),
    providesTags: (result, error, id) => [{ type: 'GoodsIssuance', id }],
    extraOptions: {},
  }),
  getGoodsIssuanceByNumber: builder.query<GoodsIssuance, string>({
    query: (number) => ({
      url: `/ops/goods-issuance/number/${number}`,
    }),
    providesTags: (result, error, number) => [{ type: 'GoodsIssuance', id: number }],
    extraOptions: {},
  }),
  createGoodsIssuance: builder.mutation<GoodsIssuance, CreateGoodsIssuanceRequest>({
    query: (body) => ({
      url: '/ops/goods-issuance',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['GoodsIssuance'],
    extraOptions: {},
  }),
  updateGoodsIssuance: builder.mutation<GoodsIssuance, { id: number; body: UpdateGoodsIssuanceRequest }>({
    query: ({ id, body }) => ({
      url: `/ops/goods-issuance/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'GoodsIssuance', id }],
    extraOptions: {},
  }),
  approveGoodsIssuance: builder.mutation<GoodsIssuance, { id: number; body?: ApproveGoodsIssuanceRequest }>({
    query: ({ id, body }) => ({
      url: `/ops/goods-issuance/${id}/approve`,
      method: 'POST',
      body: body || {},
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'GoodsIssuance', id }],
    extraOptions: {},
  }),
  cancelGoodsIssuance: builder.mutation<GoodsIssuance, number>({
    query: (id) => ({
      url: `/ops/goods-issuance/${id}/cancel`,
      method: 'POST',
    }),
    invalidatesTags: (result, error, id) => [{ type: 'GoodsIssuance', id }],
    extraOptions: {},
  }),
  deleteGoodsIssuance: builder.mutation<void, number>({
    query: (id) => ({
      url: `/ops/goods-issuance/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['GoodsIssuance'],
    extraOptions: {},
  }),
});
