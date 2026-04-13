'use client';

import { format } from 'date-fns';
import { Package, Factory, ShoppingCart, Clock } from 'lucide-react';

interface RecentActivity {
  id: number;
  date: string;
  reference: string;
  type: string;
}

interface RecentActivities {
  goodsReceipts: RecentActivity[];
  productionBatches: RecentActivity[];
  salesOrders: RecentActivity[];
}

interface RecentActivityProps {
  activities: RecentActivities;
  loading?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'goods-receipt':
      return Package;
    case 'production-batch':
      return Factory;
    case 'sales-order':
      return ShoppingCart;
    default:
      return Clock;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'goods-receipt':
      return 'text-green-600 bg-green-100';
    case 'production-batch':
      return 'text-blue-600 bg-blue-100';
    case 'sales-order':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Combine and sort all activities by date
  const allActivities = [
    ...activities.goodsReceipts.map(a => ({ ...a, category: 'Goods Receipt' })),
    ...activities.productionBatches.map(a => ({ ...a, category: 'Production' })),
    ...activities.salesOrders.map(a => ({ ...a, category: 'Sales' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10); // Show only the 10 most recent

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {allActivities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No recent activities</p>
        ) : (
          allActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={`${activity.type}-${activity.id}`} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.reference}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.category}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(activity.date), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
