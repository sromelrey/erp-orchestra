import {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { TagTypes } from './baseApi';

export enum ProductionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ProductionWorkOrder {
  id: number;
  batchId: number;
  stepName: string;
  status: ProductionStatus;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
}

export interface ProductionConsumption {
  id: number;
  batchId: number;
  itemId: number;
  item?: {
    id: number;
    code: string;
    name: string;
    baseUomId?: number;
  };
  plannedQuantity: number;
  actualQuantity?: number;
  wasteQuantity: number;
}

export interface ProductionBom {
  id: number;
  bomCode?: string;
  parentMaterialId?: number;
  parentMaterial?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface ProductionBatch {
  id: number;
  tenantId: number;
  batchNo: string;
  bomId: number;
  bom?: ProductionBom;
  plannedQuantity: number;
  actualQuantity?: number;
  status: ProductionStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
  workOrders?: ProductionWorkOrder[];
  consumptions?: ProductionConsumption[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface ProductionWorkOrderDto {
  stepName: string;
  notes?: string;
}

export interface CreateProductionBatchRequest {
  bomId: number;
  plannedQuantity: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
  workOrders?: ProductionWorkOrderDto[];
}

export interface UpdateProductionBatchRequest {
  plannedQuantity?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface ProductionBatchFilters {
  page?: number;
  limit?: number;
  status?: ProductionStatus;
  batchNo?: string;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProductionBatchListResponse {
  batches: ProductionBatch[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BomListItem {
  id: number;
  bomCode?: string;
  status?: string;
  parentMaterialId?: number;
  parentMaterial?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface BomListResponse {
  boms?: BomListItem[];
  data?: BomListItem[];
  items?: BomListItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Standard RTK Query pattern across all API files
export const productionEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({
  getBoms: builder.query<BomListItem[], void>({
    query: () => ({
      url: '/ops/bom',
      params: { limit: 100 },
    }),
    transformResponse: (response: BomListResponse | BomListItem[]) => {
      if (Array.isArray(response)) return response;
      return (response as BomListResponse).boms
        || (response as BomListResponse).data
        || (response as BomListResponse).items
        || [];
    },
  }),

  getProductionBatches: builder.query<ProductionBatchListResponse, ProductionBatchFilters>({
    query: (params: ProductionBatchFilters) => ({
      url: '/ops/production-batches',
      params,
    }),
    providesTags: (result: ProductionBatchListResponse | undefined) =>
      result?.batches
        ? [
            ...result.batches.map(({ id }) => ({
              type: 'ProductionBatch' as const,
              id,
            })),
            { type: 'ProductionBatch' as const, id: 'LIST' },
          ]
        : [{ type: 'ProductionBatch' as const, id: 'LIST' }],
  }),

  getProductionBatchById: builder.query<ProductionBatch, string | number>({
    query: (id: string | number) => `/ops/production-batches/${id}`,
    providesTags: (_result: ProductionBatch | undefined, _error: unknown, id: string | number) => [
      { type: 'ProductionBatch' as const, id },
    ],
  }),

  createProductionBatch: builder.mutation<ProductionBatch, CreateProductionBatchRequest>({
    query: (body: CreateProductionBatchRequest) => ({
      url: '/ops/production-batches',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'ProductionBatch' as const, id: 'LIST' }],
  }),

  updateProductionBatch: builder.mutation<
    ProductionBatch,
    { id: string | number; body: UpdateProductionBatchRequest }
  >({
    query: ({ id, body }: { id: string | number; body: UpdateProductionBatchRequest }) => ({
      url: `/ops/production-batches/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (
      _result: ProductionBatch | undefined,
      _error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'ProductionBatch' as const, id },
      { type: 'ProductionBatch' as const, id: 'LIST' },
    ],
  }),

  deleteProductionBatch: builder.mutation<void, string | number>({
    query: (id: string | number) => ({
      url: `/ops/production-batches/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'ProductionBatch' as const, id: 'LIST' }],
  }),

  startProductionBatch: builder.mutation<ProductionBatch, string | number>({
    query: (id: string | number) => ({
      url: `/ops/production-batches/${id}/start`,
      method: 'POST',
    }),
    invalidatesTags: (
      _result: ProductionBatch | undefined,
      _error: unknown,
      id: string | number
    ) => [
      { type: 'ProductionBatch' as const, id },
      { type: 'ProductionBatch' as const, id: 'LIST' },
    ],
  }),

  completeProductionBatch: builder.mutation<
    ProductionBatch,
    { id: string | number; actualQuantity: number }
  >({
    query: ({ id, actualQuantity }: { id: string | number; actualQuantity: number }) => ({
      url: `/ops/production-batches/${id}/complete`,
      method: 'POST',
      body: { actualQuantity },
    }),
    invalidatesTags: (
      _result: ProductionBatch | undefined,
      _error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'ProductionBatch' as const, id },
      { type: 'ProductionBatch' as const, id: 'LIST' },
    ],
  }),

  cancelProductionBatch: builder.mutation<
    ProductionBatch,
    { id: string | number; reason: string }
  >({
    query: ({ id, reason }: { id: string | number; reason: string }) => ({
      url: `/ops/production-batches/${id}/cancel`,
      method: 'POST',
      body: { reason },
    }),
    invalidatesTags: (
      _result: ProductionBatch | undefined,
      _error: unknown,
      { id }: { id: string | number }
    ) => [
      { type: 'ProductionBatch' as const, id },
      { type: 'ProductionBatch' as const, id: 'LIST' },
    ],
  }),
});
