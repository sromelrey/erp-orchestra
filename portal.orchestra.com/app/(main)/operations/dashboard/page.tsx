'use client';

import { useState } from 'react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { MaterialsChart } from '@/components/dashboard/MaterialsChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MonthlyMetricsCards } from '@/components/dashboard/MonthlyMetricsCards';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { ExpenseDistributionChart } from '@/components/dashboard/ExpenseDistributionChart';
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart';
import { InventoryStatusCards } from '@/components/dashboard/InventoryStatusCards';
import { useDashboard } from '@/hooks/operations/useDashboard';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type DashboardView = 'OVERVIEW' | 'OPERATIONS' | 'FINANCIAL' | 'INVENTORY';

const viewTitleMap: Record<DashboardView, string> = {
  OVERVIEW: 'Overview',
  OPERATIONS: 'Operations Insights',
  FINANCIAL: 'Financial Insights',
  INVENTORY: 'Inventory Insights',
};

export default function DashboardPage() {
  const [view, setView] = useState<DashboardView>('OVERVIEW');
  
  const {
    isLoading,
    hasError,
    statCards,
    salesChartData,
    productionChartData,
    materialsChartData,
    monthlySalesChartData,
    monthlyExpenseChartData,
    topCustomersChartData,
    businessMetrics,
    dashboardData,
    refetchAll,
  } = useDashboard();

  return (
    <PermissionGuard permission="operations.dashboard.view">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
          <Button
            onClick={refetchAll}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <LayoutDashboard className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Unable to load dashboard data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  Please check your connection and try again.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Segmentation Control */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {viewTitleMap[view]}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a view to focus on specific insights
            </p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['OVERVIEW', 'OPERATIONS', 'FINANCIAL', 'INVENTORY'] as DashboardView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  view === v
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {v.charAt(0) + v.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Always Visible: Monthly Metrics & Primary Chart */}
        <div className="space-y-6">
          <MonthlyMetricsCards
            thisMonthRevenue={businessMetrics?.thisMonthRevenue || 0}
            thisMonthExpense={businessMetrics?.thisMonthExpense || 0}
            thisMonthGrossProfit={(businessMetrics?.thisMonthRevenue || 0) - (businessMetrics?.thisMonthExpense || 0)}
            grossMargin={businessMetrics?.grossMargin || 0}
            loading={isLoading}
          />
          
          <SalesTrendChart data={monthlySalesChartData} loading={isLoading} />
        </div>

        {/* Main Layout: Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* OVERVIEW View */}
            {view === 'OVERVIEW' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Inventory Status</h3>
                <InventoryStatusCards
                  value={businessMetrics?.inventoryStatus?.value || 0}
                  turnover={businessMetrics?.inventoryStatus?.turnover || 0}
                  lowStockCount={businessMetrics?.inventoryStatus?.lowStockCount || 0}
                  loading={isLoading}
                />
              </div>
              
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <RecentActivity 
                  activities={dashboardData?.recentActivities || {
                    goodsReceipts: [],
                    productionBatches: [],
                    salesOrders: [],
                  }} 
                  loading={isLoading}
                />
              </div>
            </div>
            )}

            {/* OPERATIONS View */}
            {view === 'OPERATIONS' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Operations Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                      <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        color={card.color}
                        icon={card.icon}
                        loading={isLoading}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SalesChart data={salesChartData} loading={isLoading} />
                  <ProductionChart data={productionChartData} loading={isLoading} />
                </div>
                
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <RecentActivity 
                    activities={dashboardData?.recentActivities || {
                      goodsReceipts: [],
                      productionBatches: [],
                      salesOrders: [],
                    }} 
                    loading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* FINANCIAL View */}
            {view === 'FINANCIAL' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ExpenseDistributionChart data={monthlyExpenseChartData} loading={isLoading} />
                  <TopCustomersChart data={topCustomersChartData} loading={isLoading} />
                </div>
              </div>
            )}

            {/* INVENTORY View */}
            {view === 'INVENTORY' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Inventory Status</h3>
                  <InventoryStatusCards
                    value={businessMetrics?.inventoryStatus?.value || 0}
                    turnover={businessMetrics?.inventoryStatus?.turnover || 0}
                    lowStockCount={businessMetrics?.inventoryStatus?.lowStockCount || 0}
                    loading={isLoading}
                  />
                </div>
                
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Materials Overview</h3>
                  <MaterialsChart data={materialsChartData} loading={isLoading} />
                </div>
              </div>
            )}
        </div>

        {/* Sticky Business Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(businessMetrics?.totalRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Expenses</span>
                <span className="text-sm font-semibold text-red-600">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(businessMetrics?.totalExpense || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gross Profit</span>
                <span className={`text-sm font-semibold ${(businessMetrics?.grossProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(businessMetrics?.grossProfit || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gross Margin</span>
                <span className={`text-sm font-semibold ${(businessMetrics?.grossMargin || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(businessMetrics?.grossMargin || 0).toFixed(1)}%
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stock Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(dashboardData?.inventory.totalStockValue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">WIP Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(dashboardData?.production.wipValue || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
