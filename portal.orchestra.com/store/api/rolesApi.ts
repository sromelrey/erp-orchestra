import { baseApi } from './baseApi';
import { Role, Permission } from '@/types';

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/system/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Role' as const, id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    getRole: builder.query<Role, number>({
      query: (id) => `/system/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    }),
    createRole: builder.mutation<Role, Omit<Role, 'id'> & { permissionIds?: number[] }>({
      query: (data) => ({
        url: '/system/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    updateRole: builder.mutation<Role, Partial<Role> & Pick<Role, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/system/roles/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Role', id }],
    }),
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/system/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    getPermissions: builder.query<Permission[], void>({
      query: () => '/system/permissions',
      providesTags: [{ type: 'Permission', id: 'LIST' }],
    }),
    assignPermissions: builder.mutation<Role, { roleId: number; permissionIds: number[] }>({
      query: ({ roleId, permissionIds }) => ({
        url: `/system/roles/${roleId}/permissions`,
        method: 'POST',
        body: { permissionIds },
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),
    removePermissions: builder.mutation<Role, { roleId: number; permissionIds: number[] }>({
      query: ({ roleId, permissionIds }) => ({
        url: `/system/roles/${roleId}/permissions`,
        method: 'DELETE',
        body: { permissionIds },
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),
    assignUsers: builder.mutation<Role, { roleId: number; userIds: number[] }>({
      query: ({ roleId, userIds }) => ({
        url: `/system/roles/${roleId}/users`,
        method: 'POST',
        body: { userIds }, 
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'User', id: 'LIST' },
      ],
    }),
    removeUserFromRole: builder.mutation<void, { roleId: number; userId: number }>({
      query: ({ roleId, userId }) => ({
        url: `/system/roles/${roleId}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

// Correcting the assignUsers body based on original file:
// body: { userIds } (line 93)

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useAssignPermissionsMutation,
  useRemovePermissionsMutation,
  useAssignUsersMutation,
  useRemoveUserFromRoleMutation,
} = rolesApi;
