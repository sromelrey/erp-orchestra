import { baseApi } from './baseApi';

export interface TimeEvent {
  id: number;
  employeeId: number;
  type: 'CLOCK_IN' | 'CLOCK_OUT';
  timestamp: string;
  location?: { lat: number; lng: number; accuracy?: number };
  ipAddress?: string;
  deviceInfo?: string;
}

export interface AttendanceStatus {
  status: 'CLOCKED_IN' | 'CLOCKED_OUT' | 'NOT_CLOCKED_IN';
  clockedInAt: string | null;
  lastClockOutAt?: string;
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceStatus: builder.query<AttendanceStatus, void>({
      query: () => '/hris/attendance/status',
      providesTags: ['Attendance'],
    }),
    clockIn: builder.mutation<TimeEvent, { location?: any; deviceInfo?: string }>({
      query: (body) => ({
        url: '/hris/attendance/clock-in',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),
    clockOut: builder.mutation<TimeEvent, { location?: any; deviceInfo?: string }>({
      query: (body) => ({
        url: '/hris/attendance/clock-out',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),
    getAttendanceLogs: builder.query<TimeEvent[], void>({
      query: () => '/hris/attendance/logs',
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceStatusQuery,
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceLogsQuery,
} = attendanceApi;
