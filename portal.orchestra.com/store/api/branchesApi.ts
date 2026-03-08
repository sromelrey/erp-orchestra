import { baseApi } from './baseApi';

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<any, { limit?: number; cursor?: string | number; [key: string]: any }>({
      query: (params) => ({
        url: '/hris/branches',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'Branches' as const, id })),
              { type: 'Branches', id: 'LIST' },
            ]
          : [{ type: 'Branches', id: 'LIST' }],
    }),
    createBranch: builder.mutation<any, any>({
      query: (body) => ({
        url: '/hris/branches',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Branches', id: 'LIST' }],
    }),
    getBranchById: builder.query<any, string | number>({
      query: (id) => `/hris/branches/${id}`,
      providesTags: (result, error, id) => [{ type: 'Branches', id }],
    }),
    updateBranch: builder.mutation<any, { id: string | number; body: any }>({
      query: ({ id, body }) => ({
        url: `/hris/branches/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Branches', id },
        { type: 'Branches', id: 'LIST' },
      ],
    }),
    deleteBranch: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/hris/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Branches', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchesApi;
