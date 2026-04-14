'use client';

import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';

interface MonthlyMetricsCardsProps {
  thisMonthRevenue: number;
  thisMonthExpense: number;
  thisMonthGrossProfit: number;
  grossMargin: number;
  loading?: boolean;
}

export function MonthlyMetricsCards({
  thisMonthRevenue,
  thisMonthExpense,
  thisMonthGrossProfit,
  grossMargin,
  loading = false,
}: MonthlyMetricsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
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

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const cards = [
    {
      title: 'This Month Revenue',
      value: formatCurrency(thisMonthRevenue),
      icon: DollarSign,
      color: 'bg-green-100 text-green-700',
      trend: 'up',
    },
    {
      title: 'This Month Expense',
      value: formatCurrency(thisMonthExpense),
      icon: TrendingDown,
      color: 'bg-red-100 text-red-700',
      trend: 'down',
    },
    {
      title: 'Gross Profit',
      value: formatCurrency(thisMonthGrossProfit),
      icon: TrendingUp,
      color: thisMonthGrossProfit >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700',
      trend: thisMonthGrossProfit >= 0 ? 'up' : 'down',
    },
    {
      title: 'Gross Margin',
      value: formatPercent(grossMargin),
      icon: Percent,
      color: grossMargin >= 0 ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700',
      trend: grossMargin >= 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
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
