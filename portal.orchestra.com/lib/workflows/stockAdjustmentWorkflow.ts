/**
 * Stock Adjustment Workflow Configuration
 *
 * Defines the state machine for stock adjustment status transitions:
 * DRAFT → APPROVED (updates stock levels)
 * DRAFT → CANCELLED
 */

import { CheckCircle, XCircle } from 'lucide-react';
import { WorkflowConfig } from './types';
import { StockAdjustment } from '@/store/api/stockAdjustmentsApi';

export type StockAdjustmentStatus = 'DRAFT' | 'APPROVED' | 'CANCELLED';

/**
 * Stock Adjustment Workflow Configuration
 */
export const stockAdjustmentWorkflow: WorkflowConfig<StockAdjustmentStatus, Record<string, unknown>> = {
  initial: 'DRAFT' as StockAdjustmentStatus,
  statusField: 'status',
  getStatus: (item: Record<string, unknown>) => (item as unknown as StockAdjustment).status as StockAdjustmentStatus,
  transitions: {
    DRAFT: [
      {
        to: 'APPROVED' as StockAdjustmentStatus,
        label: 'Approve Adjustment',
        icon: CheckCircle,
        variant: 'default',
        handlerKey: 'approve',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as StockAdjustment).status as StockAdjustmentStatus;
          return String(status).toUpperCase() === 'DRAFT';
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to approve this stock adjustment?',
        confirm: {
          title: 'Approve Stock Adjustment',
          description: (item: Record<string, unknown>) => {
            const adjustment = item as unknown as StockAdjustment;
            return `Approve stock adjustment ${adjustment.adjustmentNumber}? This will update stock levels and cannot be undone.`;
          },
          variant: 'default',
          confirmLabel: 'Approve',
        },
      },
      {
        to: 'CANCELLED' as StockAdjustmentStatus,
        label: 'Cancel Adjustment',
        icon: XCircle,
        variant: 'destructive',
        handlerKey: 'cancel',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as StockAdjustment).status as StockAdjustmentStatus;
          return String(status).toUpperCase() === 'DRAFT';
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this stock adjustment?',
        confirm: {
          title: 'Cancel Stock Adjustment',
          description: (item: Record<string, unknown>) => {
            const adjustment = item as unknown as StockAdjustment;
            return `Cancel stock adjustment ${adjustment.adjustmentNumber}? This action cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel',
        },
      },
    ],
    APPROVED: [],
    CANCELLED: [],
  },
};

/**
 * Helper to get status color for stock adjustment
 */
export function getStockAdjustmentStatusColor(status: StockAdjustmentStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-700';
    case 'APPROVED':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
