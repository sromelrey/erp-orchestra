import { CheckCircle, XCircle } from 'lucide-react';
import { WorkflowConfig } from './types';
import { StockTransfer } from '@/store/api/stockTransfersApi';

export type StockTransferStatus = 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';

export const stockTransferWorkflow: WorkflowConfig<StockTransferStatus, Record<string, unknown>> = {
  initial: 'PENDING' as StockTransferStatus,
  statusField: 'status',
  getStatus: (item: Record<string, unknown>) => (item as unknown as StockTransfer).status as StockTransferStatus,
  transitions: {
    PENDING: [
      {
        to: 'APPROVED' as StockTransferStatus,
        label: 'Approve Transfer',
        icon: CheckCircle,
        variant: 'default',
        handlerKey: 'approve',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as StockTransfer).status as StockTransferStatus;
          return String(status).toUpperCase() === 'PENDING';
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to approve this stock transfer?',
        confirm: {
          title: 'Approve Stock Transfer',
          description: (item: Record<string, unknown>) => {
            const transfer = item as unknown as StockTransfer;
            return `Approve stock transfer ${transfer.transferNumber}? This will initiate the transfer process.`;
          },
          variant: 'default',
          confirmLabel: 'Approve',
        },
      },
      {
        to: 'CANCELLED' as StockTransferStatus,
        label: 'Cancel Transfer',
        icon: XCircle,
        variant: 'destructive',
        handlerKey: 'cancel',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as StockTransfer).status as StockTransferStatus;
          return String(status).toUpperCase() === 'PENDING';
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this stock transfer?',
        confirm: {
          title: 'Cancel Stock Transfer',
          description: (item: Record<string, unknown>) => {
            const transfer = item as unknown as StockTransfer;
            return `Cancel stock transfer ${transfer.transferNumber}? This action cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel',
        },
      },
    ],
    APPROVED: [],
    IN_TRANSIT: [],
    RECEIVED: [],
    CANCELLED: [],
  },
};

export function getStockTransferStatusColor(status: StockTransferStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-100 text-gray-700';
    case 'APPROVED':
      return 'bg-blue-100 text-blue-700';
    case 'IN_TRANSIT':
      return 'bg-yellow-100 text-yellow-700';
    case 'RECEIVED':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
