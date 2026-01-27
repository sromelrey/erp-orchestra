import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const systemModulesApi = createApi({
  reducerPath: 'systemModulesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['SystemModules'],
  endpoints: (builder) => ({
    getSystemModules: builder.query<any, { limit?: number; cursor?: string | number }>({
      query: (params) => ({
        url: '/system-modules',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'SystemModules' as const, id })),
              { type: 'SystemModules', id: 'LIST' },
            ]
          : [{ type: 'SystemModules', id: 'LIST' }],
    }),
    createSystemModule: builder.mutation<any, any>({
      query: (body) => ({
        url: '/system-modules',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SystemModules', id: 'LIST' }],
    }),
    getSystemModuleById: builder.query<any, string | number>({
      query: (id) => `/system-modules/${id}`,
      providesTags: (result, error, id) => [{ type: 'SystemModules', id }],
    }),
    updateSystemModule: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: `/system-modules/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SystemModules', id },
        { type: 'SystemModules', id: 'LIST' },
      ],
    }),
    deleteSystemModule: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/system-modules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SystemModules', id: 'LIST' }],
    }),
    getSystemModuleOptions: builder.query<{ id: number; name: string; code: string }[], void>({
      query: () => '/system-modules/options',
      providesTags: [{ type: 'SystemModules', id: 'OPTIONS' }],
    }),
  }),
});

export const {
  useGetSystemModulesQuery,
  useCreateSystemModuleMutation,
  useGetSystemModuleByIdQuery,
  useUpdateSystemModuleMutation,
  useDeleteSystemModuleMutation,
  useGetSystemModuleOptionsQuery,
} = systemModulesApi;
