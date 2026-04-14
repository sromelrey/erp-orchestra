import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Dashboard', 'Sales', 'Inventory', 'Production', 'Materials'],
  endpoints: () => ({}),
});

// Dashboard Types
export interface RecentActivity {
  id: number;
  date: string;
  reference: string;
  type: string;
}

// Business Metrics Types
export interface MonthlyDataPoint {
  month: string;
  amount: number;
}

export interface TopCustomer {
  name: string;
  amount: number;
}

export interface InventoryStatus {
  value: number;
  turnover: number;
  lowStockCount: number;
}

export interface BusinessMetrics {
  totalRevenue: number;
  thisMonthRevenue: number;
  totalExpense: number;
  thisMonthExpense: number;
  grossProfit: number;
  grossMargin: number;
  monthlySales: MonthlyDataPoint[];
  monthlyExpenses: MonthlyDataPoint[];
  monthlyGrossProfit: MonthlyDataPoint[];
  topCustomers: TopCustomer[];
  inventoryStatus: InventoryStatus;
}

export interface RecentActivities {
  goodsReceipts: RecentActivity[];
  productionBatches: RecentActivity[];
  salesOrders: RecentActivity[];
}

export interface SalesOverview {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  thisMonthRevenue: number;
}

export interface InventoryOverview {
  totalStockValue: number;
  lowStockItems: number;
  totalItems: number;
  totalWarehouses: number;
  recentMovements: number;
}

export interface ProductionOverview {
  activeBatches: number;
  completedBatches: number;
  totalBatches: number;
  completionRate: number;
  wipValue: number;
}

export interface MaterialsOverview {
  totalMaterials: number;
  rawMaterials: number;
  finishedGoods: number;
  semiFinished: number;
  services: number;
}

export interface DashboardOverview {
  sales: SalesOverview;
  inventory: InventoryOverview;
  production: ProductionOverview;
  materials: MaterialsOverview;
  recentActivities: RecentActivities;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => '/ops/dashboard/overview',
      providesTags: ['Dashboard'],
    }),
    getSalesOverview: builder.query<SalesOverview, void>({
      query: () => '/ops/dashboard/sales',
      providesTags: ['Dashboard', 'Sales'],
    }),
    getInventoryOverview: builder.query<InventoryOverview, void>({
      query: () => '/ops/dashboard/inventory',
      providesTags: ['Dashboard', 'Inventory'],
    }),
    getProductionOverview: builder.query<ProductionOverview, void>({
      query: () => '/ops/dashboard/production',
      providesTags: ['Dashboard', 'Production'],
    }),
    getMaterialsOverview: builder.query<MaterialsOverview, void>({
      query: () => '/ops/dashboard/materials',
      providesTags: ['Dashboard', 'Materials'],
    }),
    getBusinessMetrics: builder.query<BusinessMetrics, void>({
      query: () => '/ops/dashboard/business-metrics',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetSalesOverviewQuery,
  useGetInventoryOverviewQuery,
  useGetProductionOverviewQuery,
  useGetMaterialsOverviewQuery,
  useGetBusinessMetricsQuery,
} = dashboardApi;
