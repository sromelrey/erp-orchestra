import { baseApi } from './baseApi';

export enum PaymentFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  SEMI_MONTHLY = 'semi-monthly',
  MONTHLY = 'monthly',
}

export enum DeductionType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  RECURRING = 'recurring',
  VARIABLE = 'variable',
}

export enum DeductionFrequency {
  ONE_TIME = 'one-time',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

export interface EmployeeCompensation {
  id: number;
  employeeId: number;
  baseSalary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  effectiveDate: string;
  endDate?: string;
  currency: string;
  paymentFrequency: PaymentFrequency;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDeduction {
  id: number;
  employeeId: number;
  name: string;
  type: DeductionType;
  amount?: number;
  percentage?: number;
  frequency: DeductionFrequency;
  effectiveDate: string;
  endDate?: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompensationHistory {
  id: number;
  employeeId: number;
  field: string;
  oldValue?: string;
  newValue?: string;
  changedBy: number;
  changedAt: string;
  changeReason?: string;
}

export interface CreateCompensationDto {
  baseSalary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  effectiveDate: string;
  endDate?: string;
  currency?: string;
  paymentFrequency?: PaymentFrequency;
  changeReason?: string;
}

export interface UpdateCompensationDto {
  baseSalary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  effectiveDate?: string;
  endDate?: string;
  currency?: string;
  paymentFrequency?: PaymentFrequency;
  changeReason?: string;
}

export interface CreateDeductionDto {
  name: string;
  type: DeductionType;
  amount?: number;
  percentage?: number;
  frequency: DeductionFrequency;
  effectiveDate: string;
  endDate?: string;
  description?: string;
}

export interface UpdateDeductionDto {
  name?: string;
  type?: DeductionType;
  amount?: number;
  percentage?: number;
  frequency?: DeductionFrequency;
  effectiveDate?: string;
  endDate?: string;
  description?: string;
}

export interface CompensationCalculation {
  baseSalary: number;
  hourlyRate?: number;
  overtimeRate?: number;
  currency: string;
}

export interface DeductionCalculation {
  totalDeductions: number;
}

export const compensationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Compensation endpoints
    getEmployeeCompensation: builder.query<EmployeeCompensation[], number>({
      query: (employeeId) => `/hris/employees/${employeeId}/compensation`,
      providesTags: (result, error, employeeId) => [{ type: 'Compensation', id: employeeId }],
    }),

    createEmployeeCompensation: builder.mutation<
      EmployeeCompensation,
      { employeeId: number; body: CreateCompensationDto }
    >({
      query: ({ employeeId, body }) => ({
        url: `/hris/employees/${employeeId}/compensation`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { employeeId }) => [
        { type: 'Compensation', id: employeeId },
      ],
    }),

    updateEmployeeCompensation: builder.mutation<
      EmployeeCompensation,
      { employeeId: number; id: number; body: UpdateCompensationDto }
    >({
      query: ({ employeeId, id, body }) => ({
        url: `/hris/employees/${employeeId}/compensation/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { employeeId }) => [
        { type: 'Compensation', id: employeeId },
      ],
    }),

    deleteEmployeeCompensation: builder.mutation<void, { employeeId: number; id: number }>({
      query: ({ employeeId, id }) => ({
        url: `/hris/employees/${employeeId}/compensation/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { employeeId }) => [
        { type: 'Compensation', id: employeeId },
      ],
    }),

    getCompensationHistory: builder.query<CompensationHistory[], number>({
      query: (employeeId) => `/hris/employees/${employeeId}/compensation/history`,
      providesTags: (result, error, employeeId) => [
        { type: 'CompensationHistory', id: employeeId },
      ],
    }),

    calculateCompensation: builder.query<
      CompensationCalculation,
      { employeeId: number; date: string }
    >({
      query: ({ employeeId, date }) =>
        `/hris/employees/${employeeId}/compensation/calculate/${date}`,
    }),

    // Deduction endpoints
    getEmployeeDeductions: builder.query<EmployeeDeduction[], number>({
      query: (employeeId) => `/hris/employees/${employeeId}/deductions`,
      providesTags: (result, error, employeeId) => [{ type: 'Deductions', id: employeeId }],
    }),

    createEmployeeDeduction: builder.mutation<
      EmployeeDeduction,
      { employeeId: number; body: CreateDeductionDto }
    >({
      query: ({ employeeId, body }) => ({
        url: `/hris/employees/${employeeId}/deductions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { employeeId }) => [{ type: 'Deductions', id: employeeId }],
    }),

    updateEmployeeDeduction: builder.mutation<
      EmployeeDeduction,
      { employeeId: number; id: number; body: UpdateDeductionDto }
    >({
      query: ({ employeeId, id, body }) => ({
        url: `/hris/employees/${employeeId}/deductions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { employeeId }) => [{ type: 'Deductions', id: employeeId }],
    }),

    deleteEmployeeDeduction: builder.mutation<void, { employeeId: number; id: number }>({
      query: ({ employeeId, id }) => ({
        url: `/hris/employees/${employeeId}/deductions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { employeeId }) => [{ type: 'Deductions', id: employeeId }],
    }),

    calculateDeductions: builder.query<DeductionCalculation, { employeeId: number; date: string }>({
      query: ({ employeeId, date }) => `/hris/employees/${employeeId}/deductions/calculate/${date}`,
    }),
  }),
});

export const {
  useGetEmployeeCompensationQuery,
  useLazyGetEmployeeCompensationQuery,
  useCreateEmployeeCompensationMutation,
  useUpdateEmployeeCompensationMutation,
  useDeleteEmployeeCompensationMutation,
  useGetCompensationHistoryQuery,
  useCalculateCompensationQuery,
  useGetEmployeeDeductionsQuery,
  useLazyGetEmployeeDeductionsQuery,
  useCreateEmployeeDeductionMutation,
  useUpdateEmployeeDeductionMutation,
  useDeleteEmployeeDeductionMutation,
  useCalculateDeductionsQuery,
} = compensationApi;
