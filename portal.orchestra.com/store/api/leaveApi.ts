import { baseApi } from './baseApi';

export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  isPaid: boolean;
  defaultDaysPerYear: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employee?: any;
  leaveTypeId: number;
  leaveType?: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedById?: number;
  approver?: any;
  approvedAt?: string;
  comments?: string;
  createdAt: string;
}

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveTypes: builder.query<LeaveType[], void>({
      query: () => '/hris/leave-types',
      providesTags: ['LeaveTypes'],
    }),
    createLeaveType: builder.mutation<LeaveType, Partial<LeaveType>>({
      query: (body) => ({
        url: '/hris/leave-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LeaveTypes'],
    }),
    updateLeaveType: builder.mutation<LeaveType, { id: number; data: Partial<LeaveType> }>({
      query: ({ id, data }) => ({
        url: `/hris/leave-types/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['LeaveTypes'],
    }),
    deleteLeaveType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/hris/leave-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LeaveTypes'],
    }),

    getLeaveRequests: builder.query<LeaveRequest[], { employeeId?: number }>({
      query: (params) => ({
        url: '/hris/leave-requests',
        params,
      }),
      providesTags: ['LeaveRequests'],
    }),
    getMyLeaveRequests: builder.query<LeaveRequest[], void>({
      query: () => '/hris/leave-requests/my-requests',
      providesTags: ['LeaveRequests'],
    }),
    createLeaveRequest: builder.mutation<LeaveRequest, Partial<LeaveRequest>>({
      query: (body) => ({
        url: '/hris/leave-requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LeaveRequests'],
    }),
    updateLeaveRequestStatus: builder.mutation<LeaveRequest, { id: number; status: string; comment?: string }>({
      query: ({ id, ...body }) => ({
        url: `/hris/leave-requests/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['LeaveRequests'],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
  useGetLeaveRequestsQuery,
  useGetMyLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestStatusMutation,
} = leaveApi;
