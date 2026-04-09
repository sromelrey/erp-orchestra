/**
 * Sales Order Workflow Configuration
 *
 * Defines the state machine for sales order status transitions:
 * DRAFT → CONFIRMED → SHIPPED → DELIVERED
 * CANCELLED can be reached from DRAFT or CONFIRMED
 */

import { CheckCircle, Truck, Package, XCircle } from 'lucide-react';
import { WorkflowConfig } from './types';
import { SalesOrderStatus } from '@/store/api/salesOrdersApi';
import type { SalesOrder } from '@/store/api/salesOrdersApi';

/**
 * Sales Order Workflow Configuration
 */
export const salesOrderWorkflow: WorkflowConfig<SalesOrderStatus, Record<string, unknown>> = {
  initial: SalesOrderStatus.DRAFT,
  statusField: 'status',
  getStatus: (item: Record<string, unknown>) => (item as unknown as SalesOrder).status,
  transitions: {
    [SalesOrderStatus.DRAFT]: [
      {
        to: SalesOrderStatus.CONFIRMED,
        label: 'Confirm Order',
        icon: CheckCircle,
        variant: 'default',
        permission: 'operations.sales-order.update',
        handlerKey: 'confirm',
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to confirm this order?',
        confirm: {
          title: 'Confirm Order',
          description: (item: Record<string, unknown>) => {
            const order = item as unknown as SalesOrder;
            return `Confirm order ${order.orderNo} for ${order.customerName}? This will move the order to confirmed status and begin processing.`;
          },
          variant: 'default',
          confirmLabel: 'Confirm',
        },
      },
      {
        to: SalesOrderStatus.CANCELLED,
        label: 'Cancel Order',
        icon: XCircle,
        variant: 'destructive',
        permission: 'operations.sales-order.update',
        handlerKey: 'cancel',
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this order?',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as SalesOrder).status;
          return status !== SalesOrderStatus.CANCELLED;
        },
        confirm: {
          title: 'Cancel Order',
          description: (item: Record<string, unknown>) => {
            const order = item as unknown as SalesOrder;
            return `Cancel order ${order.orderNo} for ${order.customerName}? This will cancel the order and cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel Order',
        },
      },
    ],
    [SalesOrderStatus.CONFIRMED]: [
      {
        to: SalesOrderStatus.SHIPPED,
        label: 'Ship Order',
        icon: Truck,
        variant: 'secondary',
        permission: 'operations.sales-order.update',
        handlerKey: 'ship',
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to ship this order?',
        confirm: {
          title: 'Ship Order',
          description: (item: Record<string, unknown>) => {
            const order = item as unknown as SalesOrder;
            return `Ship order ${order.orderNo} for ${order.customerName}? This will mark the order as shipped.`;
          },
          variant: 'default',
          confirmLabel: 'Ship',
        },
      },
      {
        to: SalesOrderStatus.CANCELLED,
        label: 'Cancel Order',
        icon: XCircle,
        variant: 'destructive',
        permission: 'operations.sales-order.update',
        handlerKey: 'cancel',
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this order?',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as SalesOrder).status;
          return status !== SalesOrderStatus.CANCELLED;
        },
        confirm: {
          title: 'Cancel Order',
          description: (item: Record<string, unknown>) => {
            const order = item as unknown as SalesOrder;
            return `Cancel order ${order.orderNo} for ${order.customerName}? This will cancel the order and cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel Order',
        },
      },
    ],
    [SalesOrderStatus.SHIPPED]: [
      {
        to: SalesOrderStatus.DELIVERED,
        label: 'Deliver Order',
        icon: Package,
        variant: 'default',
        permission: 'operations.sales-order.update',
        handlerKey: 'deliver',
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to mark this order as delivered?',
        confirm: {
          title: 'Deliver Order',
          description: (item: Record<string, unknown>) => {
            const order = item as unknown as SalesOrder;
            return `Mark order ${order.orderNo} for ${order.customerName} as delivered? This will update the order status to delivered.`;
          },
          variant: 'default',
          confirmLabel: 'Deliver',
        },
      },
    ],
    [SalesOrderStatus.DELIVERED]: [],
    [SalesOrderStatus.CANCELLED]: [],
  },
};

/**
 * Helper to get status icon for sales order
 */
export function getSalesOrderStatusIcon(status: SalesOrderStatus) {
  switch (status) {
    case SalesOrderStatus.DRAFT:
      return CheckCircle;
    case SalesOrderStatus.CONFIRMED:
      return CheckCircle;
    case SalesOrderStatus.SHIPPED:
      return Truck;
    case SalesOrderStatus.DELIVERED:
      return Package;
    case SalesOrderStatus.CANCELLED:
      return XCircle;
    default:
      return CheckCircle;
  }
}

/**
 * Helper to get status color for sales order
 */
export function getSalesOrderStatusColor(status: SalesOrderStatus): string {
  switch (status) {
    case SalesOrderStatus.DRAFT:
      return 'bg-gray-100 text-gray-700';
    case SalesOrderStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-700';
    case SalesOrderStatus.SHIPPED:
      return 'bg-yellow-100 text-yellow-700';
    case SalesOrderStatus.DELIVERED:
      return 'bg-green-100 text-green-700';
    case SalesOrderStatus.CANCELLED:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
