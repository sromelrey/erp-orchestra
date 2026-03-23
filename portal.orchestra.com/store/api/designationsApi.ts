import { baseApi } from './baseApi';
import { Designation, PaginatedResponse } from '@/types';

export const designationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query<
      PaginatedResponse<Designation>,
      {
        limit?: number;
        cursor?: string | number;
        [key: string]: string | number | boolean | undefined;
      }
    >({
      query: (params) => ({
        url: '/hris/designations',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Designations' as const,
                id,
              })),
              { type: 'Designations', id: 'LIST' },
            ]
          : [{ type: 'Designations', id: 'LIST' }],
    }),
    createDesignation: builder.mutation<Designation, Partial<Designation>>({
      query: (body) => ({
        url: '/hris/designations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Designations', id: 'LIST' }],
    }),
    getDesignationById: builder.query<Designation, string | number>({
      query: (id) => `/hris/designations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Designations', id }],
    }),
    updateDesignation: builder.mutation<
      Designation,
      { id: string | number; body: Partial<Designation> }
    >({
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
