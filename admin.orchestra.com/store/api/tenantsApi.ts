import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tenantsApi = createApi({
  reducerPath: 'tenantsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Tenants', 'TenantUsers'],
  endpoints: (builder) => ({
    getTenants: builder.query<any, { limit?: number; cursor?: string | number }>({
      query: (params) => ({
        url: '/tenants',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'Tenants' as const, id })),
              { type: 'Tenants', id: 'LIST' },
            ]
          : [{ type: 'Tenants', id: 'LIST' }],
    }),
    createTenant: builder.mutation<any, any>({
      query: (body) => ({
        url: '/tenants',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tenants', id: 'LIST' }],
    }),
    getTenantById: builder.query<any, string | number>({
      query: (id) => `/tenants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tenants', id }],
    }),
    updateTenant: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: `/tenants/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Tenants', id },
        { type: 'Tenants', id: 'LIST' },
      ],
    }),
    deleteTenant: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/tenants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tenants', id: 'LIST' }],
    }),
    getTenantUsers: builder.query<any, { tenantId: string | number; cursor?: string | number }>({
      query: ({ tenantId, ...params }) => ({
        url: `/users/tenant/${tenantId}`,
        params,
      }),
      providesTags: (result, error, { tenantId }) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'TenantUsers' as const, id })),
              { type: 'TenantUsers', id: `LIST_${tenantId}` },
            ]
          : [{ type: 'TenantUsers', id: `LIST_${tenantId}` }],
    }),
    createTenantUser: builder.mutation<any, { tenantId: string | number; body: any }>({
      query: ({ tenantId, body }) => ({
        url: `/users/tenant/${tenantId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { tenantId }) => [{ type: 'TenantUsers', id: `LIST_${tenantId}` }],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useGetTenantUsersQuery,
  useCreateTenantUserMutation,
} = tenantsApi;
