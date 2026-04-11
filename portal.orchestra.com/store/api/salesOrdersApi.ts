import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { PaginatedResponse } from '@/types';
import { TagTypes } from './baseApi';

export enum SalesOrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface SalesOrderItem {
  id: number;
  salesOrderId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitOfMeasureId: number;
  unitOfMeasureCode: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  lineTotal: number;
  deliveredQuantity: number;
  allocatedQuantity: number;
  warehouseId: number;
  warehouseName: string;
  locationId: number;
  locationName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tenantId: number;
}

export interface SalesOrder {
  id: number;
  orderNo: string;
  customerId?: number;
  customerName: string;
  orderDate: string;
  deliveryDate?: string;
  status: SalesOrderStatus;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  notes?: string;
  approvedBy?: number;
  approvedAt?: string;
  shippedAt?: string;
  shippedBy?: number;
  deliveredAt?: string;
  deliveredBy?: number;
  createdBy?: number;
  updatedBy?: number;
  deletedBy?: number;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  items?: SalesOrderItem[];
}

export interface CreateSalesOrderItemRequest {
  itemId: number;
  quantity: number;
  unitOfMeasureId: number;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  warehouseId: number;
  locationId: number;
  notes?: string;
}

export interface CreateSalesOrderRequest {
  customerName: string;
  orderDate?: string;
  deliveryDate?: string;
  notes?: string;
  items: CreateSalesOrderItemRequest[];
}

export interface UpdateSalesOrderRequest {
  customerName?: string;
  deliveryDate?: string;
  notes?: string;
  discountAmount?: number;
  taxAmount?: number;
}

export interface ConfirmOrderRequest {
  notes?: string;
  approvedBy?: number;
}

export interface ShipOrderRequest {
  notes?: string;
  shippedBy?: number;
}

export interface DeliverItemRequest {
  orderItemId: number;
  deliveredQuantity: number;
}

export interface DeliverOrderRequest {
  deliveredItems: DeliverItemRequest[];
  notes?: string;
  deliveredBy?: number;
}

export interface CancelOrderRequest {
  reason?: string;
  notes?: string;
}

export interface SalesOrderFilters {
  page?: number;
  limit?: number;
  status?: SalesOrderStatus;
  customerName?: string;
  orderNo?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const salesOrdersEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    getSalesOrders: builder.query<PaginatedResponse<SalesOrder>, SalesOrderFilters>({
      query: (params: SalesOrderFilters) => ({
        url: '/ops/sales-orders',
        params,
      }),
      transformResponse: (response: { orders: SalesOrder[]; pagination: { page: number; limit: number; total: number; totalPages: number } }) => {
        return {
          data: response.orders,
          meta: {
            nextCursor: response.pagination.page < response.pagination.totalPages ? response.pagination.page + 1 : null,
            total: response.pagination.total,
          },
        };
      },
      providesTags: (result: PaginatedResponse<SalesOrder> | undefined) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'SalesOrders' as const,
                id,
              })),
              { type: 'SalesOrders', id: 'LIST' },
            ]
          : [{ type: 'SalesOrders', id: 'LIST' }],
    }),
    getSalesOrderById: builder.query<SalesOrder, string | number>({
      query: (id: string | number) => `/ops/sales-orders/${id}`,
      providesTags: (_result: SalesOrder | undefined, _error: unknown, id: string | number) => [
        { type: 'SalesOrders', id },
      ],
    }),
    createSalesOrder: builder.mutation<SalesOrder, CreateSalesOrderRequest>({
      query: (body: CreateSalesOrderRequest) => ({
        url: '/ops/sales-orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SalesOrders', id: 'LIST' }],
    }),
    updateSalesOrder: builder.mutation<
      SalesOrder,
      { id: string | number; body: UpdateSalesOrderRequest }
    >({
      query: ({ id, body }: { id: string | number; body: UpdateSalesOrderRequest }) => ({
        url: `/ops/sales-orders/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (
        result: SalesOrder | undefined,
        error: unknown,
        { id }: { id: string | number }
      ) => [
        { type: 'SalesOrders', id },
        { type: 'SalesOrders', id: 'LIST' },
      ],
    }),
    deleteSalesOrder: builder.mutation<void, string | number>({
      query: (id: string | number) => ({
        url: `/ops/sales-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SalesOrders', id: 'LIST' }],
    }),
    confirmSalesOrder: builder.mutation<SalesOrder, { id: string | number; body: ConfirmOrderRequest }>({
      query: ({ id, body }: { id: string | number; body: ConfirmOrderRequest }) => ({
        url: `/ops/sales-orders/${id}/confirm`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (
        result: SalesOrder | undefined,
        error: unknown,
        { id }: { id: string | number }
      ) => [
        { type: 'SalesOrders', id },
        { type: 'SalesOrders', id: 'LIST' },
      ],
    }),
    shipSalesOrder: builder.mutation<SalesOrder, { id: string | number; body: ShipOrderRequest }>({
      query: ({ id, body }: { id: string | number; body: ShipOrderRequest }) => ({
        url: `/ops/sales-orders/${id}/ship`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (
        result: SalesOrder | undefined,
        error: unknown,
        { id }: { id: string | number }
      ) => [
        { type: 'SalesOrders', id },
        { type: 'SalesOrders', id: 'LIST' },
      ],
    }),
    deliverSalesOrder: builder.mutation<SalesOrder, { id: string | number; body: DeliverOrderRequest }>({
      query: ({ id, body }: { id: string | number; body: DeliverOrderRequest }) => ({
        url: `/ops/sales-orders/${id}/deliver`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (
        result: SalesOrder | undefined,
        error: unknown,
        { id }: { id: string | number }
      ) => [
        { type: 'SalesOrders', id },
        { type: 'SalesOrders', id: 'LIST' },
      ],
    }),
    cancelSalesOrder: builder.mutation<SalesOrder, { id: string | number; body: CancelOrderRequest }>({
      query: ({ id, body }: { id: string | number; body: CancelOrderRequest }) => ({
        url: `/ops/sales-orders/${id}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (
        result: SalesOrder | undefined,
        error: unknown,
        { id }: { id: string | number }
      ) => [
        { type: 'SalesOrders', id },
        { type: 'SalesOrders', id: 'LIST' },
      ],
    }),
});

// Hooks will be exported from the main API index file
