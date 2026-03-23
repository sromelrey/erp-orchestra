import { baseApi } from './baseApi';

export enum TimesheetStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  LOCKED = 'LOCKED',
}

export enum JobExecutionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

export interface TimesheetDay {
  id: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  regularHours: number;
  overtimeHours: number;
  isAnomaly: boolean;
  anomalyReason: string | null;
}

export interface Timesheet {
  id: string;
  employeeId: number;
  employee?: {
    firstName: string;
    lastName: string;
  };
  payPeriodId: number;
  status: TimesheetStatus;
  totalRegularHours: number;
  totalOvertimeHours: number;
  days?: TimesheetDay[];
}

export interface TimesheetSummary {
  total: number;
  approved: number;
  pending: number;
  anomalies: number;
}

export interface JobExecutionLog {
  id: number;
  jobName: string;
  metadata: Record<string, unknown>;
  status: JobExecutionStatus;
  errorMessage: string | null;
  processedCount: number;
  errorCount: number;
  startedAt: string;
  completedAt: string;
  tenantId: number;
  createdAt: string;
}

export const timesheetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimesheets: builder.query<Timesheet[], { payPeriodId: number }>({
      query: ({ payPeriodId }) => `/hris/timesheets?payPeriodId=${payPeriodId}`,
      providesTags: ['Timesheets'],
    }),
    getTimesheetSummary: builder.query<TimesheetSummary, { payPeriodId: number }>({
      query: ({ payPeriodId }) => `/hris/timesheets/summary?payPeriodId=${payPeriodId}`,
      providesTags: ['Timesheets'],
    }),
    getTimesheet: builder.query<Timesheet, string>({
      query: (id) => `/hris/timesheets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Timesheets' as const, id }],
    }),
    generateTimesheets: builder.mutation<{ generated: number }, { payPeriodId: number }>({
      query: (body) => ({
        url: '/hris/timesheets/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Timesheets'],
    }),
    updateTimesheetStatus: builder.mutation<Timesheet, { id: string; status: TimesheetStatus }>({
      query: ({ id, status }) => ({
        url: `/hris/timesheets/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Timesheets',
        { type: 'Timesheets' as const, id },
      ],
    }),
    getJobStatus: builder.query<JobExecutionLog[], void>({
      query: () => '/hris/timesheets/job-status',
      providesTags: ['Timesheets'],
    }),
    triggerCron: builder.mutation<void, void>({
      query: () => ({
        url: '/hris/timesheets/trigger-cron',
        method: 'POST',
      }),
      invalidatesTags: ['Timesheets'],
    }),
  }),
});

export const {
  useGetTimesheetsQuery,
  useGetTimesheetSummaryQuery,
  useGetTimesheetQuery,
  useGenerateTimesheetsMutation,
  useUpdateTimesheetStatusMutation,
  useGetJobStatusQuery,
  useTriggerCronMutation,
} = timesheetsApi;
