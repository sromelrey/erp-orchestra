import { baseApi } from './baseApi';
import { Department, PaginatedResponse } from '@/types';

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<
      PaginatedResponse<Department>,
      {
        limit?: number;
        cursor?: string | number;
        [key: string]: string | number | boolean | undefined;
      }
    >({
      query: (params) => ({
        url: '/hris/departments',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Departments' as const,
                id,
              })),
              { type: 'Departments', id: 'LIST' },
            ]
          : [{ type: 'Departments', id: 'LIST' }],
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => ({
        url: '/hris/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Departments', id: 'LIST' }],
    }),
    getDepartmentById: builder.query<Department, string | number>({
      query: (id) => `/hris/departments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Departments', id }],
    }),
    updateDepartment: builder.mutation<
      Department,
      { id: string | number; body: Partial<Department> }
    >({
      query: ({ id, body }) => ({
        url: `/hris/departments/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Departments', id },
        { type: 'Departments', id: 'LIST' },
      ],
    }),
    deleteDepartment: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/hris/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Departments', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
