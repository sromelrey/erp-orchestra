import { baseApi } from './baseApi';

export enum PayPeriodStatus {
  OPEN = 'OPEN',
  PROCESSING = 'PROCESSING',
  CLOSED = 'CLOSED',
}

export interface PayPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: PayPeriodStatus;
  createdAt: string;
}

export const payPeriodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayPeriods: builder.query<PayPeriod[], void>({
      query: () => '/hris/pay-periods',
      providesTags: ['PayPeriods'],
    }),
    createPayPeriod: builder.mutation<PayPeriod, Partial<PayPeriod>>({
      query: (body) => ({
        url: '/hris/pay-periods',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PayPeriods'],
    }),
    updatePayPeriod: builder.mutation<PayPeriod, { id: number | string; body: Partial<PayPeriod> }>(
      {
        query: ({ id, body }) => ({
          url: `/hris/pay-periods/${id}`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['PayPeriods'],
      }
    ),
    deletePayPeriod: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/hris/pay-periods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PayPeriods'],
    }),
  }),
});

export const {
  useGetPayPeriodsQuery,
  useCreatePayPeriodMutation,
  useUpdatePayPeriodMutation,
  useDeletePayPeriodMutation,
} = payPeriodsApi;
