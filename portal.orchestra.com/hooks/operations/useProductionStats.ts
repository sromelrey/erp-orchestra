import { useMemo } from 'react';
import { ProductionBatch, ProductionStatus } from '@/store/api/productionApi';
import { Activity, CheckCircle, Clock, XCircle, PlayCircle } from 'lucide-react';

interface UseProductionStatsProps {
  productionBatches: ProductionBatch[];
}

export function useProductionStats({ productionBatches }: UseProductionStatsProps) {
  const statsCards = useMemo(() => {
    const total = productionBatches.length;
    const planned = productionBatches.filter((b) => b.status === ProductionStatus.PLANNED).length;
    const inProgress = productionBatches.filter((b) => b.status === ProductionStatus.IN_PROGRESS).length;
    const completed = productionBatches.filter((b) => b.status === ProductionStatus.COMPLETED).length;
    const cancelled = productionBatches.filter((b) => b.status === ProductionStatus.CANCELLED).length;

    return [
      {
        title: 'Total Batches',
        value: total,
        icon: Activity,
        description: 'All production batches',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Planned',
        value: planned,
        icon: Clock,
        description: 'Awaiting start',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'In Progress',
        value: inProgress,
        icon: PlayCircle,
        description: 'Currently producing',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      },
      {
        title: 'Completed',
        value: completed,
        icon: CheckCircle,
        description: 'Successfully finished',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Cancelled',
        value: cancelled,
        icon: XCircle,
        description: 'Cancelled batches',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
    ];
  }, [productionBatches]);

  return { statsCards };
}
