import { baseApi } from './baseApi';

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<any, { limit?: number; cursor?: string | number; [key: string]: any }>({
      query: (params) => ({
        url: '/hris/departments',
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }: { id: string | number }) => ({ type: 'Departments' as const, id })),
              { type: 'Departments', id: 'LIST' },
            ]
          : [{ type: 'Departments', id: 'LIST' }],
    }),
    createDepartment: builder.mutation<any, any>({
      query: (body) => ({
        url: '/hris/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Departments', id: 'LIST' }],
    }),
    getDepartmentById: builder.query<any, string | number>({
      query: (id) => `/hris/departments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Departments', id }],
    }),
    updateDepartment: builder.mutation<any, { id: string | number; body: any }>({
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
