'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  Factory,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  color: string;
  icon: string | LucideIcon;
  loading?: boolean;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  Factory,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
};

export function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
  loading = false,
  change,
  changeType,
}: StatCardProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                )}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', color)}>
          {IconComponent && <IconComponent className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
}

