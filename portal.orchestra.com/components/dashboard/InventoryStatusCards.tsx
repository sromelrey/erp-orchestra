'use client';

import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface InventoryStatusCardsProps {
  value: number;
  turnover: number;
  lowStockCount: number;
  loading?: boolean;
}

export function InventoryStatusCards({
  value,
  turnover,
  lowStockCount,
  loading = false,
}: InventoryStatusCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTurnover = (value: number) => {
    return `${value.toFixed(2)}x`;
  };

  const cards = [
    {
      title: 'Inventory Value',
      value: formatCurrency(value),
      subtitle: 'Total stock value',
      icon: Package,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Turnover Ratio',
      value: formatTurnover(turnover),
      subtitle: '12-month turnover',
      icon: TrendingUp,
      color: turnover >= 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount.toString(),
      subtitle: 'Items below threshold',
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
