import { baseApi } from './baseApi';
import {
  User,
  PaginatedResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserPermission,
} from '@/types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (response: PaginatedResponse<User>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    getUserPermissions: builder.query<UserPermission[], number>({
      query: (userId) => `/users/${userId}/permissions`,
      providesTags: (_result, _error, userId) => [{ type: 'UserPermission', id: `USER_${userId}` }],
    }),
    getEffectivePermissions: builder.query<string[], number>({
      query: (userId) => `/users/${userId}/permissions/effective`,
      providesTags: (_result, _error, userId) => [
        { type: 'UserPermission', id: `EFFECTIVE_${userId}` },
      ],
    }),
    assignUserPermissions: builder.mutation<
      User,
      {
        userId: number;
        permissionIds: number[];
        type: 'GRANT' | 'DENY';
        expiresAt?: string;
      }
    >({
      query: ({ userId, ...data }) => ({
        url: `/users/${userId}/permissions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'UserPermission', id: `USER_${userId}` },
        { type: 'UserPermission', id: `EFFECTIVE_${userId}` },
      ],
    }),
    removeUserPermissions: builder.mutation<
      User,
      {
        userId: number;
        permissionIds: number[];
      }
    >({
      query: ({ userId, ...data }) => ({
        url: `/users/${userId}/permissions`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'UserPermission', id: `USER_${userId}` },
        { type: 'UserPermission', id: `EFFECTIVE_${userId}` },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserPermissionsQuery,
  useGetEffectivePermissionsQuery,
  useAssignUserPermissionsMutation,
  useRemoveUserPermissionsMutation,
} = usersApi;
