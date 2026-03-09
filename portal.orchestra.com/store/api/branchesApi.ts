import { baseApi } from './baseApi';
import { Branch, PaginatedResponse } from '@/types';

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<PaginatedResponse<Branch>, { limit?: number; cursor?: string | number; [key: string]: string | number | boolean | undefined }>({
      query: (params) => ({
        url: '/hris/branches',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Branches' as const, id })),
              { type: 'Branches', id: 'LIST' },
            ]
          : [{ type: 'Branches', id: 'LIST' }],
    }),
    createBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (body) => ({
        url: '/hris/branches',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Branches', id: 'LIST' }],
    }),
    getBranchById: builder.query<Branch, string | number>({
      query: (id) => `/hris/branches/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Branches', id }],
    }),
    updateBranch: builder.mutation<Branch, { id: string | number; body: Partial<Branch> }>({
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
