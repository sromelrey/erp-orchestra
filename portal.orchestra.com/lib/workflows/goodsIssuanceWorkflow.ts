/**
 * Goods Issuance Workflow Configuration
 *
 * Defines the state machine for goods issuance status transitions:
 * DRAFT → APPROVED (deducts stock from warehouse)
 * DRAFT → CANCELLED
 */

import { CheckCircle, XCircle } from 'lucide-react';
import { WorkflowConfig } from './types';
import { GoodsIssuance } from '@/store/api/goodsIssuanceApi';

export type GoodsIssuanceStatus = 'DRAFT' | 'APPROVED' | 'CANCELLED';

/**
 * Goods Issuance Workflow Configuration
 */
export const goodsIssuanceWorkflow: WorkflowConfig<GoodsIssuanceStatus, Record<string, unknown>> = {
  initial: 'DRAFT' as GoodsIssuanceStatus,
  statusField: 'status',
  getStatus: (item: Record<string, unknown>) => (item as unknown as GoodsIssuance).status as GoodsIssuanceStatus,
  transitions: {
    DRAFT: [
      {
        to: 'APPROVED' as GoodsIssuanceStatus,
        label: 'Approve Issuance',
        icon: CheckCircle,
        variant: 'default',
        // permission: 'operations.goods-issuance.approve', // TODO: Add to user role
        handlerKey: 'approve',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as GoodsIssuance).status as GoodsIssuanceStatus;
          return String(status).toUpperCase() === 'DRAFT';
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to approve this goods issuance?',
        confirm: {
          title: 'Approve Goods Issuance',
          description: (item: Record<string, unknown>) => {
            const issuance = item as unknown as GoodsIssuance;
            return `Approve goods issuance ${issuance.issuanceNumber}? This will deduct stock from the warehouse and cannot be undone.`;
          },
          variant: 'default',
          confirmLabel: 'Approve',
        },
      },
      {
        to: 'CANCELLED' as GoodsIssuanceStatus,
        label: 'Cancel Issuance',
        icon: XCircle,
        variant: 'destructive',
        // permission: 'operations.goods-issuance.cancel', // TODO: Add to user role
        handlerKey: 'cancel',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as GoodsIssuance).status as GoodsIssuanceStatus;
          return String(status).toUpperCase() === 'DRAFT';
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this goods issuance?',
        confirm: {
          title: 'Cancel Goods Issuance',
          description: (item: Record<string, unknown>) => {
            const issuance = item as unknown as GoodsIssuance;
            return `Cancel goods issuance ${issuance.issuanceNumber}? This will cancel the issuance and cannot be undone.`;
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
 * Helper to get status icon for goods issuance
 */
export function getGoodsIssuanceStatusIcon(status: GoodsIssuanceStatus) {
  switch (status) {
    case 'DRAFT':
      return CheckCircle;
    case 'APPROVED':
      return CheckCircle;
    case 'CANCELLED':
      return XCircle;
    default:
      return CheckCircle;
  }
}

/**
 * Helper to get status color for goods issuance
 */
export function getGoodsIssuanceStatusColor(status: GoodsIssuanceStatus): string {
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
