import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { TagTypes } from './baseApi';

export interface Addon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'PHYSICAL' | 'SERVICE';
  basePrice: string | number;
  materialId?: number | null;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  rules?: AddonRule[];
}

interface AddonRule {
  id: number;
  addonId: number;
  ruleType: string;
  thresholdValue: number;
  discountPercent: number;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  addon?: { name: string };
}

interface AddonWithRules extends Addon {
  inclusionRules?: AddonRule[];
}

export interface CreateAddonRequest {
  code?: string;
  name: string;
  description?: string;
  type: 'PHYSICAL' | 'SERVICE';
  basePrice: number;
  materialId?: number;
  isActive?: boolean;
  rules?: Array<{
    ruleType: string;
    thresholdValue: number;
    discountPercent: number;
    isActive?: boolean;
  }>;
}

export interface UpdateAddonRequest {
  code?: string;
  name?: string;
  description?: string;
  type?: 'PHYSICAL' | 'SERVICE';
  basePrice?: number;
  materialId?: number;
  isActive?: boolean;
  rules?: Array<{
    id?: number;
    ruleType: string;
    thresholdValue: number;
    discountPercent: number;
    isActive?: boolean;
  }>;
}

interface CalculateAddonPriceRequest {
  addonId: number;
  quantity?: number;
  context?: Record<string, unknown>;
}

interface CalculateAddonPriceResponse {
  addonId: number;
  basePrice: number;
  calculatedPrice: number;
  appliedRules?: Array<{
    ruleId: number;
    ruleName: string;
    adjustment: number;
  }>;
}

interface EligibilityCheckResponse {
  addonId: number;
  isEligible: boolean;
  reason?: string;
}

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  [key: string]: unknown;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const addonsEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, TagTypes, 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
    // Add-ons
    getAddons: builder.query<PaginatedResponse<Addon>, QueryParams>({
      query: (params) => ({
        url: '/addons',
        method: 'GET',
        params,
      }),
      providesTags: ['Addon'],
    }),
    getAddonById: builder.query<Addon, number>({
      query: (id) => `/addons/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Addon', id }],
    }),
    createAddon: builder.mutation<Addon, CreateAddonRequest>({
      query: (body) => ({
        url: '/addons',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Addon'],
    }),
    updateAddon: builder.mutation<Addon, { id: number; body: UpdateAddonRequest }>({
      query: ({ id, body }) => ({
        url: `/addons/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Addon', id }],
    }),
    deleteAddon: builder.mutation<void, number>({
      query: (id) => ({
        url: `/addons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Addon'],
    }),

    
    // Add-on Pricing Calculator
    calculateAddonPrice: builder.mutation<CalculateAddonPriceResponse, CalculateAddonPriceRequest>({
      query: (body) => ({
        url: '/addons/calculate-price',
        method: 'POST',
        body,
      }),
    }),

    // Get Add-on with Rules
    getAddonWithRules: builder.query<AddonWithRules, number>({
      query: (id) => `/addons/${id}/rules`,
      providesTags: (_result, _error, id) => [{ type: 'Addon', id }, { type: 'AddonRule', id }],
    }),

    
    // Check Eligibility
    checkAddonEligibility: builder.query<EligibilityCheckResponse, number>({
      query: (id) => `/addons/${id}/check-eligibility`,
      providesTags: (_result, _error, id) => [{ type: 'Addon', id }],
    }),
  });

// Hooks will be exported from the main API index file
