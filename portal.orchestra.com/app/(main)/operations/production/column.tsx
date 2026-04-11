'use client';

import { Column } from '@/components/ui/data-table';
import { ProductionBatch, ProductionStatus } from '@/store/api/productionApi';
import { getProductionStatusColor } from '@/lib/workflows/productionWorkflow';
import { format } from 'date-fns';

const statusLabels: Record<ProductionStatus, string> = {
  [ProductionStatus.PLANNED]: 'Planned',
  [ProductionStatus.IN_PROGRESS]: 'In Progress',
  [ProductionStatus.COMPLETED]: 'Completed',
  [ProductionStatus.CANCELLED]: 'Cancelled',
};

export function getStatusBadge(status: ProductionStatus) {
  const colorClass = getProductionStatusColor(status);
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

export const columns: Column<ProductionBatch>[] = [
  {
    accessorKey: 'batchNo',
    header: 'Batch No',
    cell: (batch: ProductionBatch) => (
      <span className="font-medium">{batch.batchNo}</span>
    ),
  },
  {
    accessorKey: 'bom',
    header: 'BOM / Product',
    cell: (batch: ProductionBatch) => (
      <span>{batch.bom?.parentMaterial?.name || `BOM #${batch.bomId}`}</span>
    ),
  },
  {
    accessorKey: 'plannedQuantity',
    header: 'Planned Qty',
    cell: (batch: ProductionBatch) => (
      <span className="text-right w-full block">{batch.plannedQuantity}</span>
    ),
  },
  {
    accessorKey: 'actualQuantity',
    header: 'Actual Qty',
    cell: (batch: ProductionBatch) => (
      <span className="text-right w-full block">
        {batch.actualQuantity !== undefined && batch.actualQuantity !== null
          ? batch.actualQuantity
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (batch: ProductionBatch) => getStatusBadge(batch.status),
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: (batch: ProductionBatch) => (
      <span>{batch.startDate ? format(new Date(batch.startDate), 'MMM dd, yyyy') : '-'}</span>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: (batch: ProductionBatch) => (
      <span>{batch.endDate ? format(new Date(batch.endDate), 'MMM dd, yyyy') : '-'}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (batch: ProductionBatch) => (
      <span>{batch.createdAt ? format(new Date(batch.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</span>
    ),
  },
];
