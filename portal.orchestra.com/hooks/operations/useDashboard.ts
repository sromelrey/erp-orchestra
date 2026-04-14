import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  useGetDashboardOverviewQuery,
  useGetSalesOverviewQuery,
  useGetInventoryOverviewQuery,
  useGetProductionOverviewQuery,
  useGetMaterialsOverviewQuery,
  useGetBusinessMetricsQuery,
} from '@/store/api/dashboardApi';

export const useDashboard = () => {
  // Fetch all dashboard data
  const {
    data: dashboardData,
    isLoading: isLoadingOverview,
    error: overviewError,
    refetch: refetchOverview,
  } = useGetDashboardOverviewQuery();

  // Fetch business metrics
  const {
    data: businessMetrics,
    isLoading: isLoadingBusinessMetrics,
    error: businessMetricsError,
    refetch: refetchBusinessMetrics,
  } = useGetBusinessMetricsQuery();

  const {
    data: salesData,
    isLoading: isLoadingSales,
    error: salesError,
    refetch: refetchSales,
  } = useGetSalesOverviewQuery();

  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    error: inventoryError,
    refetch: refetchInventory,
  } = useGetInventoryOverviewQuery();

  const {
    data: productionData,
    isLoading: isLoadingProduction,
    error: productionError,
    refetch: refetchProduction,
  } = useGetProductionOverviewQuery();

  const {
    data: materialsData,
    isLoading: isLoadingMaterials,
    error: materialsError,
    refetch: refetchMaterials,
  } = useGetMaterialsOverviewQuery();

  // Handle errors
  const hasError = useMemo(
    () => !!(overviewError || salesError || inventoryError || productionError || materialsError || businessMetricsError),
    [overviewError, salesError, inventoryError, productionError, materialsError, businessMetricsError]
  );

  // Show error toast
  if (hasError) {
    toast.error('Failed to load dashboard data');
  }

  // Calculate loading state
  const isLoading = useMemo(
    () => isLoadingOverview || isLoadingSales || isLoadingInventory || isLoadingProduction || isLoadingMaterials || isLoadingBusinessMetrics,
    [isLoadingOverview, isLoadingSales, isLoadingInventory, isLoadingProduction, isLoadingMaterials, isLoadingBusinessMetrics]
  );

  // Refetch all data
  const refetchAll = () => {
    refetchOverview();
    refetchSales();
    refetchInventory();
    refetchProduction();
    refetchMaterials();
    refetchBusinessMetrics();
  };

  // Memoized stat cards data
  const statCards = useMemo(() => {
    if (!dashboardData) return [];

    const { sales, inventory, production, materials } = dashboardData;

    return [
      {
        title: 'Total Orders',
        value: sales.totalOrders,
        subtitle: `${sales.confirmedOrders} confirmed`,
        color: 'bg-blue-100 text-blue-700',
        icon: 'ShoppingCart',
      },
      {
        title: 'Active Batches',
        value: production.activeBatches,
        subtitle: `${production.completionRate.toFixed(1)}% completion`,
        color: 'bg-green-100 text-green-700',
        icon: 'Factory',
      },
      {
        title: 'Low Stock Items',
        value: inventory.lowStockItems,
        subtitle: 'Need attention',
        color: 'bg-yellow-100 text-yellow-700',
        icon: 'AlertTriangle',
      },
      {
        title: 'Total Materials',
        value: materials.totalMaterials,
        subtitle: `${materials.finishedGoods} finished`,
        color: 'bg-purple-100 text-purple-700',
        icon: 'Package',
      },
    ];
  }, [dashboardData]);

  // Sales chart data
  const salesChartData = useMemo(() => {
    if (!salesData) return [];

    return [
      { name: 'Draft', value: salesData.pendingOrders, color: '#94a3b8' },
      { name: 'Confirmed', value: salesData.confirmedOrders, color: '#3b82f6' },
      { name: 'Shipped', value: salesData.shippedOrders, color: '#8b5cf6' },
      { name: 'Delivered', value: salesData.deliveredOrders, color: '#10b981' },
    ];
  }, [salesData]);

  // Production chart data
  const productionChartData = useMemo(() => {
    if (!productionData) return [];

    return [
      { name: 'Active', value: productionData.activeBatches, color: '#f59e0b' },
      { name: 'Completed', value: productionData.completedBatches, color: '#10b981' },
      { name: 'Planned', value: productionData.totalBatches - productionData.activeBatches - productionData.completedBatches, color: '#6b7280' },
    ];
  }, [productionData]);

  // Materials chart data
  const materialsChartData = useMemo(() => {
    if (!materialsData) return [];

    return [
      { name: 'Raw Materials', value: materialsData.rawMaterials, color: '#ef4444' },
      { name: 'Semi-Finished', value: materialsData.semiFinished, color: '#f59e0b' },
      { name: 'Finished Goods', value: materialsData.finishedGoods, color: '#10b981' },
      { name: 'Services', value: materialsData.services, color: '#8b5cf6' },
    ];
  }, [materialsData]);

  // Business metrics data
  const monthlySalesChartData = useMemo(() => {
    if (!businessMetrics?.monthlySales) return [];
    return businessMetrics.monthlySales.map(m => ({
      month: new Date(m.month + '-01').toLocaleDateString('en', { month: 'short' }),
      sales: m.amount,
      profit: businessMetrics.monthlyGrossProfit.find(gp => gp.month === m.month)?.amount || 0,
    }));
  }, [businessMetrics]);

  const monthlyExpenseChartData = useMemo(() => {
    if (!businessMetrics?.monthlyExpenses) return [];
    return businessMetrics.monthlyExpenses.map(m => ({
      month: new Date(m.month + '-01').toLocaleDateString('en', { month: 'short' }),
      expense: m.amount,
    }));
  }, [businessMetrics]);

  const topCustomersChartData = useMemo(() => {
    if (!businessMetrics?.topCustomers) return [];
    return businessMetrics.topCustomers.map(c => ({
      name: c.name,
      amount: c.amount,
    }));
  }, [businessMetrics]);

  
  return {
    // Data
    dashboardData,
    salesData,
    inventoryData,
    productionData,
    materialsData,
    businessMetrics,
    
    // Chart data
    statCards,
    salesChartData,
    productionChartData,
    materialsChartData,
    monthlySalesChartData,
    monthlyExpenseChartData,
    topCustomersChartData,
    
    // Loading states
    isLoading,
    isLoadingOverview,
    isLoadingSales,
    isLoadingInventory,
    isLoadingProduction,
    isLoadingMaterials,
    isLoadingBusinessMetrics,
    
    // Error state
    hasError,
    
    // Actions
    refetchAll,
    refetchOverview,
    refetchSales,
    refetchInventory,
    refetchProduction,
    refetchMaterials,
    refetchBusinessMetrics,
  };
};
