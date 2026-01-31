import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Role {
  id: string;
  name: string;
  description: string;
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      // Inherit logic from authApi.ts
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Role' as const, id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    getRole: builder.query<Role, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    }),
    createRole: builder.mutation<Role, Omit<Role, 'id'>>({
      query: (data) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    updateRole: builder.mutation<Role, Partial<Role> & Pick<Role, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Role', id }],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
