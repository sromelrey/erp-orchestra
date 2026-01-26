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
  tagTypes: ['Tenants'],
  endpoints: (builder) => ({
    getTenants: builder.query<any, { limit?: number; page?: number; search?: string }>({
      query: (params) => ({
        url: '/v1/tenants',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }: { id: string | number }) => ({ type: 'Tenants' as const, id })),
              { type: 'Tenants', id: 'LIST' },
            ]
          : [{ type: 'Tenants', id: 'LIST' }],
    }),
    createTenant: builder.mutation<any, any>({
      query: (body) => ({
        url: '/v1/tenants',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tenants', id: 'LIST' }],
    }),
    getTenantById: builder.query<any, string | number>({
      query: (id) => `/v1/tenants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tenants', id }],
    }),
    updateTenant: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: `/v1/tenants/${id}`,
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
        url: `/v1/tenants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tenants', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantsApi;
