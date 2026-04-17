'use client';

import { Column } from '@/components/ui/data-table';
import { GoodsReceipt, GoodsReceiptStatus, GoodsReceiptType } from '@/store/api/goodsReceiptsApi';
import { getGoodsReceiptStatusColor } from '@/lib/workflows/goodsReceiptWorkflow';
import { format } from 'date-fns';

const statusLabels: Record<GoodsReceiptStatus, string> = {
  [GoodsReceiptStatus.DRAFT]: 'Draft',
  [GoodsReceiptStatus.CONFIRMED]: 'Confirmed',
  [GoodsReceiptStatus.CANCELLED]: 'Cancelled',
};

const receiptTypeLabels: Record<GoodsReceiptType, string> = {
  [GoodsReceiptType.PURCHASE_ORDER]: 'Purchase Order',
  [GoodsReceiptType.PRODUCTION]: 'Production',
  [GoodsReceiptType.RETURN]: 'Return',
  [GoodsReceiptType.MANUAL]: 'Manual',
};

export function getStatusBadge(status: GoodsReceiptStatus) {
  const colorClass = getGoodsReceiptStatusColor(status);
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

export const columns: Column<GoodsReceipt>[] = [
  {
    accessorKey: 'receiptNumber',
    header: 'Receipt Number',
    cell: (receipt: GoodsReceipt) => (
      <span className="font-medium">{receipt.receiptNumber}</span>
    ),
  },
  {
    accessorKey: 'receiptType',
    header: 'Type',
    cell: (receipt: GoodsReceipt) => (
      <span>{receiptTypeLabels[receipt.receiptType] || receipt.receiptType}</span>
    ),
  },
  {
    accessorKey: 'warehouse',
    header: 'Warehouse',
    cell: (receipt: GoodsReceipt) => (
      <span>{receipt.warehouse?.name || `ID: ${receipt.warehouseId}`}</span>
    ),
  },
  {
    accessorKey: 'receiptDate',
    header: 'Receipt Date',
    cell: (receipt: GoodsReceipt) => (
      <span>{receipt.receiptDate ? format(new Date(receipt.receiptDate), 'MMM dd, yyyy') : '-'}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (receipt: GoodsReceipt) => getStatusBadge(receipt.status),
  },
  {
    accessorKey: 'totalValue',
    header: 'Total Value',
    cell: (receipt: GoodsReceipt) => (
      <span className="text-right w-full block">
        ${receipt.totalValue  || '0.00'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (receipt: GoodsReceipt) => (
      <span>{receipt.createdAt ? format(new Date(receipt.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</span>
    ),
  },
];
