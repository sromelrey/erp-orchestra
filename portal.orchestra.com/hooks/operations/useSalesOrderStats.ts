import { useMemo } from 'react';
import { ShoppingCart, CheckCircle, Truck, Package, XCircle } from 'lucide-react';
import { SalesOrderStatus } from '@/store/api/salesOrdersApi';
import { StatCard } from '@/components/entity-manager';

interface UseSalesOrderStatsProps {
  salesOrders: Array<{ status: SalesOrderStatus }>;
}

export function useSalesOrderStats({ salesOrders }: UseSalesOrderStatsProps) {
  const getStatusIcon = (status: SalesOrderStatus) => {
    switch (status) {
      case SalesOrderStatus.DRAFT:
        return ShoppingCart;
      case SalesOrderStatus.CONFIRMED:
        return CheckCircle;
      case SalesOrderStatus.SHIPPED:
        return Truck;
      case SalesOrderStatus.DELIVERED:
        return Package;
      case SalesOrderStatus.CANCELLED:
        return XCircle;
      default:
        return ShoppingCart;
    }
  };

  const stats = useMemo(() => {
    const total = salesOrders.length;
    const draft = salesOrders.filter((o) => o.status === SalesOrderStatus.DRAFT).length;
    const confirmed = salesOrders.filter((o) => o.status === SalesOrderStatus.CONFIRMED).length;
    const shipped = salesOrders.filter((o) => o.status === SalesOrderStatus.SHIPPED).length;
    const delivered = salesOrders.filter((o) => o.status === SalesOrderStatus.DELIVERED).length;
    const cancelled = salesOrders.filter((o) => o.status === SalesOrderStatus.CANCELLED).length;

    return {
      total,
      draft,
      confirmed,
      shipped,
      delivered,
      cancelled,
    };
  }, [salesOrders]);

  const statsCards: StatCard[] = useMemo(() => {
    if (stats.total === 0) return [];

    return [
      {
        label: 'Total Orders',
        value: stats.total,
        icon: ShoppingCart,
        color: 'bg-primary/10 text-primary',
      },
      {
        label: 'Draft',
        value: stats.draft,
        icon: getStatusIcon(SalesOrderStatus.DRAFT),
        color: 'bg-gray-100 text-gray-700',
      },
      {
        label: 'Confirmed',
        value: stats.confirmed,
        icon: getStatusIcon(SalesOrderStatus.CONFIRMED),
        color: 'bg-blue-100 text-blue-700',
      },
      {
        label: 'Delivered',
        value: stats.delivered,
        icon: getStatusIcon(SalesOrderStatus.DELIVERED),
        color: 'bg-green-100 text-green-700',
      },
    ];
  }, [stats]);

  return {
    stats,
    statsCards,
    getStatusIcon,
  };
}
