/**
 * Goods Receipt Workflow Configuration
 *
 * Defines the state machine for goods receipt status transitions:
 * DRAFT → CONFIRMED (creates stock movements)
 * DRAFT → CANCELLED
 */

import { CheckCircle, XCircle } from 'lucide-react';
import { WorkflowConfig } from './types';
import { GoodsReceiptStatus, GoodsReceipt } from '@/store/api/goodsReceiptsApi';

/**
 * Goods Receipt Workflow Configuration
 */
export const goodsReceiptWorkflow: WorkflowConfig<GoodsReceiptStatus, Record<string, unknown>> = {
  initial: GoodsReceiptStatus.DRAFT,
  statusField: 'status',
  getStatus: (item: Record<string, unknown>) => (item as unknown as GoodsReceipt).status,
  transitions: {
    [GoodsReceiptStatus.DRAFT]: [
      {
        to: GoodsReceiptStatus.CONFIRMED,
        label: 'Confirm Receipt',
        icon: CheckCircle,
        variant: 'default',
        permission: 'operations.goods-receipt.confirm',
        handlerKey: 'confirm',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as GoodsReceipt).status;
          return status === GoodsReceiptStatus.DRAFT;
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to confirm this goods receipt?',
        // 🔹 Enhancement: Include inventory impact preview in confirmation dialog
        confirm: {
          title: 'Confirm Goods Receipt',
          description: (item: Record<string, unknown>) => {
            const receipt = item as unknown as GoodsReceipt;
            const items = receipt.items || [];

            if (items.length === 0) {
              return `Confirm receipt ${receipt.receiptNumber}? This will mark it as confirmed.`;
            }

            // Build inventory impact preview
            const lines = items.map((lineItem) => {
              const qty = lineItem.quantityReceived ?? 0;
              const name = lineItem.item?.name || `Item #${lineItem.itemId}`;
              const warehouse = receipt.warehouse?.name || 'Unknown Warehouse';
              const location = receipt.location?.name || 'Default Location';
              return `• ${name}: +${qty} units at ${warehouse} / ${location}`;
            });

            return `Confirm receipt ${receipt.receiptNumber}?\n\nThe following inventory will be added:\n${lines.join('\n')}\n\nThis action cannot be undone.`;
          },
          variant: 'default',
          confirmLabel: 'Confirm Receipt',
        },
      },
      {
        to: GoodsReceiptStatus.CANCELLED,
        label: 'Cancel Receipt',
        icon: XCircle,
        variant: 'destructive',
        permission: 'operations.goods-receipt.cancel',
        handlerKey: 'cancel',
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this goods receipt?',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as GoodsReceipt).status;
          return status === GoodsReceiptStatus.DRAFT;
        },
        confirm: {
          title: 'Cancel Goods Receipt',
          description: (item: Record<string, unknown>) => {
            const receipt = item as unknown as GoodsReceipt;
            return `Cancel receipt ${receipt.receiptNumber}? This will cancel the receipt and cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel Receipt',
        },
      },
    ],
    [GoodsReceiptStatus.CONFIRMED]: [],
    [GoodsReceiptStatus.CANCELLED]: [],
  },
};

/**
 * Helper to get status icon for goods receipt
 */
export function getGoodsReceiptStatusIcon(status: GoodsReceiptStatus) {
  switch (status) {
    case GoodsReceiptStatus.DRAFT:
      return CheckCircle;
    case GoodsReceiptStatus.CONFIRMED:
      return CheckCircle;
    case GoodsReceiptStatus.CANCELLED:
      return XCircle;
    default:
      return CheckCircle;
  }
}

/**
 * Helper to get status color for goods receipt
 */
export function getGoodsReceiptStatusColor(status: GoodsReceiptStatus): string {
  switch (status) {
    case GoodsReceiptStatus.DRAFT:
      return 'bg-gray-100 text-gray-700';
    case GoodsReceiptStatus.CONFIRMED:
      return 'bg-green-100 text-green-700';
    case GoodsReceiptStatus.CANCELLED:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
