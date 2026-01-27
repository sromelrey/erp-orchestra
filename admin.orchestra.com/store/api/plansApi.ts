import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Plans'],
  endpoints: (builder) => ({
    getPlans: builder.query<any, { limit?: number; cursor?: string | number }>({
      query: (params) => ({
        url: '/plans',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'Plans' as const, id })),
              { type: 'Plans', id: 'LIST' },
            ]
          : [{ type: 'Plans', id: 'LIST' }],
    }),
    createPlan: builder.mutation<any, any>({
      query: (body) => ({
        url: '/plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Plans', id: 'LIST' }],
    }),
    getPlanById: builder.query<any, string | number>({
      query: (id) => `/plans/${id}`,
      providesTags: (result, error, id) => [{ type: 'Plans', id }],
    }),
    updatePlan: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: `/plans/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Plans', id },
        { type: 'Plans', id: 'LIST' },
      ],
    }),
    deletePlan: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Plans', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
