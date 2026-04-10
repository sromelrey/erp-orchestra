import { useMemo } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { GoodsReceiptStatus } from '@/store/api/goodsReceiptsApi';
import { StatCard } from '@/components/entity-manager';

interface UseGoodsReceiptStatsProps {
  goodsReceipts: Array<{ status: GoodsReceiptStatus }>;
}

export function useGoodsReceiptStats({ goodsReceipts }: UseGoodsReceiptStatsProps) {
  const getStatusIcon = (status: GoodsReceiptStatus) => {
    switch (status) {
      case GoodsReceiptStatus.DRAFT:
        return Clock;
      case GoodsReceiptStatus.CONFIRMED:
        return CheckCircle;
      case GoodsReceiptStatus.CANCELLED:
        return XCircle;
      default:
        return Package;
    }
  };

  const stats = useMemo(() => {
    const total = goodsReceipts.length;
    const draft = goodsReceipts.filter((r) => r.status === GoodsReceiptStatus.DRAFT).length;
    const confirmed = goodsReceipts.filter((r) => r.status === GoodsReceiptStatus.CONFIRMED).length;
    const cancelled = goodsReceipts.filter((r) => r.status === GoodsReceiptStatus.CANCELLED).length;

    return {
      total,
      draft,
      confirmed,
      cancelled,
    };
  }, [goodsReceipts]);

  const statsCards: StatCard[] = useMemo(() => {
    if (stats.total === 0) return [];

    return [
      {
        label: 'Total Receipts',
        value: stats.total,
        icon: Package,
        color: 'bg-primary/10 text-primary',
      },
      {
        label: 'Pending',
        value: stats.draft,
        icon: getStatusIcon(GoodsReceiptStatus.DRAFT),
        color: 'bg-gray-100 text-gray-700',
      },
      {
        label: 'Confirmed',
        value: stats.confirmed,
        icon: getStatusIcon(GoodsReceiptStatus.CONFIRMED),
        color: 'bg-green-100 text-green-700',
      },
      {
        label: 'Cancelled',
        value: stats.cancelled,
        icon: getStatusIcon(GoodsReceiptStatus.CANCELLED),
        color: 'bg-red-100 text-red-700',
      },
    ];
  }, [stats]);

  return {
    stats,
    statsCards,
    getStatusIcon,
  };
}
