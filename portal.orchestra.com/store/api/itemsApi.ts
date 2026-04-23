import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { TagTypes } from './baseApi';
import { PaginatedResponse } from '@/types';

export interface ItemCategory {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemUom {
  id: number;
  code: string;
  name: string;
  precision: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: number;
  code: string;
  name: string;
  description?: string;
  categoryId: number;
  baseUomId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ItemCategory;
  baseUom?: ItemUom;
}

export interface CreateItemRequest {
  code: string;
  name: string;
  description?: string;
  categoryId: number;
  baseUomId: number;
  isActive?: boolean;
}

export interface CreateItemCategoryRequest {
  code: string;
  name: string;
  description?: string;
}

export interface CreateItemUomRequest {
  code: string;
  name: string;
  precision: number;
}

export interface ItemsQueryParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const itemsEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
  // Item Categories
  getItemCategories: builder.query<ItemCategory[], void>({
    query: () => '/ops/item-categories',
    providesTags: ['ItemCategory'],
    extraOptions: {},
  }),
  createItemCategory: builder.mutation<ItemCategory, CreateItemCategoryRequest>({
    query: (body) => ({
      url: '/ops/item-categories',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['ItemCategory'],
    extraOptions: {},
  }),

  // Item UoMs
  getItemUoms: builder.query<ItemUom[], void>({
    query: () => '/ops/item-uoms',
    providesTags: ['ItemUom'],
    extraOptions: {},
  }),
  createItemUom: builder.mutation<ItemUom, CreateItemUomRequest>({
    query: (body) => ({
      url: '/ops/item-uoms',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['ItemUom'],
    extraOptions: {},
  }),

  // Items
  getItems: builder.query<PaginatedResponse<Item>, ItemsQueryParams>({
    query: (params) => ({
      url: '/ops/items',
      params,
    }),
    providesTags: ['Item'],
    extraOptions: {},
  }),
  createItem: builder.mutation<Item, CreateItemRequest>({
    query: (body) => ({
      url: '/ops/items',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['Item'],
    extraOptions: {},
  }),
  updateItem: builder.mutation<Item, { id: number } & Partial<CreateItemRequest>>({
    query: ({ id, ...body }) => ({
      url: `/ops/items/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'Item', id }],
    extraOptions: {},
  }),
});

// Hooks will be exported from the main API index file
