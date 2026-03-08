import { baseApi } from './baseApi';

export const designationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query<any, { limit?: number; cursor?: string | number; [key: string]: any }>({
      query: (params) => ({
        url: '/hris/designations',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'Designations' as const, id })),
              { type: 'Designations', id: 'LIST' },
            ]
          : [{ type: 'Designations', id: 'LIST' }],
    }),
    createDesignation: builder.mutation<any, any>({
      query: (body) => ({
        url: '/hris/designations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Designations', id: 'LIST' }],
    }),
    getDesignationById: builder.query<any, string | number>({
      query: (id) => `/hris/designations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Designations', id }],
    }),
    updateDesignation: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: `/hris/designations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Designations', id },
        { type: 'Designations', id: 'LIST' },
      ],
    }),
    deleteDesignation: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/hris/designations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Designations', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useGetDesignationByIdQuery,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = designationsApi;
