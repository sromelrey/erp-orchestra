import {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { TagTypes } from './baseApi';

export enum BomStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface BomItem {
  id?: number;
  bomId?: number;
  componentMaterialId: number;
  componentMaterial?: {
    id: number;
    code: string;
    name: string;
  };
  quantity: number;
  uom: string;
  scrapPercentage?: number;
  sortOrder?: number;
}

export interface Bom {
  id: number;
  code: string;
  name: string;
  parentMaterialId: number;
  parentMaterial?: {
    id: number;
    code: string;
    name: string;
  };
  version: string;
  status?: BomStatus;
  isActive: boolean;
  effectiveDate?: string;
  expiryDate?: string;
  items?: BomItem[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateBomRequest {
  code: string;
  name: string;
  parentMaterialId: number;
  version: string;
  effectiveDate?: string;
  expiryDate?: string;
  lines: BomItem[];
}

export interface UpdateBomRequest {
  code?: string;
  name?: string;
  version?: string;
  effectiveDate?: string;
  expiryDate?: string;
  lines?: BomItem[];
}

export interface UpdateBomStatusRequest {
  isActive: boolean;
}

export interface BomFilters {
  cursor?: number;
  limit?: number;
  search?: string;
  parentMaterialId?: number;
  status?: BomStatus;
  isActive?: boolean;
}

export interface BomListResponse {
  data: Bom[];
  meta: {
    nextCursor: number | null;
  };
}

export interface BomCostResult {
  bomId: number;
  totalCost: number;
  componentCosts: {
    componentMaterialId: number;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Standard RTK Query pattern across all API files
export const bomEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({
  getBoms: builder.query<BomListResponse, BomFilters>({
    query: (params: BomFilters) => ({
      url: '/ops/bom',
      params,
    }),
    providesTags: (result: BomListResponse | undefined) =>
      result?.data
        ? [
            ...result.data.map(({ id }) => ({
              type: 'Bom' as const,
              id,
            })),
            { type: 'Bom' as const, id: 'LIST' },
          ]
        : [{ type: 'Bom' as const, id: 'LIST' }],
  }),

  getBomById: builder.query<Bom, string | number>({
    query: (id: string | number) => `/ops/bom/${id}`,
    providesTags: (_result: Bom | undefined, _error: unknown, id: string | number) => [
      { type: 'Bom' as const, id },
    ],
  }),

  createBom: builder.mutation<Bom, CreateBomRequest>({
    query: (body: CreateBomRequest) => ({
      url: '/ops/bom',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Bom' as const, id: 'LIST' }],
  }),

  updateBom: builder.mutation<
    Bom,
    { id: string | number; body: UpdateBomRequest }
  >({
    query: ({ id, body }: { id: string | number; body: UpdateBomRequest }) => ({
      url: `/ops/bom/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (
      _result: Bom | undefined,
      _error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'Bom' as const, id },
      { type: 'Bom' as const, id: 'LIST' },
    ],
  }),

  deleteBom: builder.mutation<void, string | number>({
    query: (id: string | number) => ({
      url: `/ops/bom/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'Bom' as const, id: 'LIST' }],
  }),

  updateBomStatus: builder.mutation<
    Bom,
    { id: string | number; body: UpdateBomStatusRequest }
  >({
    query: ({ id, body }: { id: string | number; body: UpdateBomStatusRequest }) => ({
      url: `/ops/bom/${id}/status`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (
      _result: Bom | undefined,
      _error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'Bom' as const, id },
      { type: 'Bom' as const, id: 'LIST' },
    ],
  }),

  activateBom: builder.mutation<Bom, string | number>({
    query: (id: string | number) => ({
      url: `/ops/bom/${id}/status`,
      method: 'PATCH',
      body: { isActive: true },
    }),
    invalidatesTags: (
      _result: Bom | undefined,
      _error: unknown,
      id: string | number
    ) => [
      { type: 'Bom' as const, id },
      { type: 'Bom' as const, id: 'LIST' },
    ],
  }),

  deactivateBom: builder.mutation<Bom, string | number>({
    query: (id: string | number) => ({
      url: `/ops/bom/${id}/status`,
      method: 'PATCH',
      body: { isActive: false },
    }),
    invalidatesTags: (
      _result: Bom | undefined,
      _error: unknown,
      id: string | number
    ) => [
      { type: 'Bom' as const, id },
      { type: 'Bom' as const, id: 'LIST' },
    ],
  }),

  calculateBomCost: builder.mutation<
    BomCostResult,
    { id: string | number; options?: Record<string, unknown> }
  >({
    query: ({ id, options }: { id: string | number; options?: Record<string, unknown> }) => ({
      url: `/ops/bom/${id}/cost/calculate`,
      method: 'POST',
      body: options || {},
    }),
  }),
});
