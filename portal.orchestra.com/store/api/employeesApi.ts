import { baseApi } from './baseApi';
import { Employee, PaginatedResponse } from '@/types';

export const employeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      PaginatedResponse<Employee>,
      {
        limit?: number;
        cursor?: string | number;
        [key: string]: string | number | boolean | undefined;
      }
    >({
      query: (params) => ({
        url: '/hris/employees',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Employees' as const,
                id,
              })),
              { type: 'Employees', id: 'LIST' },
            ]
          : [{ type: 'Employees', id: 'LIST' }],
    }),
    createEmployee: builder.mutation<Employee, Partial<Employee> & { createUserAccount?: boolean }>(
      {
        query: (body) => ({
          url: '/hris/employees',
          method: 'POST',
          body,
        }),
        invalidatesTags: [{ type: 'Employees', id: 'LIST' }],
      }
    ),
    getEmployeeById: builder.query<Employee, string | number>({
      query: (id) => `/hris/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),
    updateEmployee: builder.mutation<Employee, { id: string | number; body: Partial<Employee> }>({
      query: ({ id, body }) => ({
        url: `/hris/employees/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Employees', id },
        { type: 'Employees', id: 'LIST' },
      ],
    }),
    deleteEmployee: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/hris/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Employees', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
