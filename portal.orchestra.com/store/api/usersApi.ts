import { EndpointBuilder, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import {
  User,
  PaginatedResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserPermission,
} from '@/types';

export const usersEndpoints = (builder: EndpointBuilder<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, 'User' | 'Role' | 'Permission' | 'UserPermission' | 'Session' | 'Departments' | 'Designations' | 'Branches' | 'Employees' | 'Attendance' | 'LeaveTypes' | 'LeaveRequests' | 'PayPeriods' | 'Timesheets' | 'Compensation' | 'CompensationHistory' | 'Deductions' | 'Materials' | 'Warehouse' | 'WarehouseCapacity' | 'Location' | 'StockLedger', 'baseApi'>) => ({ // eslint-disable-line @typescript-eslint/no-empty-object-type
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
      extraOptions: {},
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
      extraOptions: {},
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      extraOptions: {},
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
      extraOptions: {},
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      extraOptions: {},
    }),
    getUserPermissions: builder.query<UserPermission[], number>({
      query: (userId) => `/users/${userId}/permissions`,
      providesTags: (_result, _error, userId) => [{ type: 'UserPermission', id: `USER_${userId}` }],
      extraOptions: {},
    }),
    getEffectivePermissions: builder.query<string[], number>({
      query: (userId) => `/users/${userId}/permissions/effective`,
      providesTags: (_result, _error, userId) => [
        { type: 'UserPermission', id: `EFFECTIVE_${userId}` },
      ],
      extraOptions: {},
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
      extraOptions: {},
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
      extraOptions: {},
    }),
});

// Hooks will be exported from the main API index file
