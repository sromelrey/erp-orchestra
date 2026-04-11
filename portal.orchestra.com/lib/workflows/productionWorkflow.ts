import { PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import { WorkflowConfig } from './types';
import { ProductionStatus, ProductionBatch } from '@/store/api/productionApi';

export const productionWorkflow: WorkflowConfig<ProductionStatus, Record<string, unknown>> = {
  initial: ProductionStatus.PLANNED,
  statusField: 'status',
  getStatus: (item: Record<string, unknown>) => (item as unknown as ProductionBatch).status,
  transitions: {
    [ProductionStatus.PLANNED]: [
      {
        to: ProductionStatus.IN_PROGRESS,
        label: 'Start Production',
        icon: PlayCircle,
        variant: 'default',
        permission: 'operations.production.start',
        handlerKey: 'start',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as ProductionBatch).status;
          return status === ProductionStatus.PLANNED;
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to start this production batch?',
        confirm: {
          title: 'Start Production Batch',
          description: (item: Record<string, unknown>) => {
            const batch = item as unknown as ProductionBatch;
            const bomName = batch.bom?.parentMaterial?.name || `BOM #${batch.bomId}`;
            return `Start production batch ${batch.batchNo}?\n\nBOM: ${bomName}\nPlanned Quantity: ${batch.plannedQuantity}\n\nThis will consume materials from inventory and mark the batch as In Progress.`;
          },
          variant: 'default',
          confirmLabel: 'Start Production',
        },
      },
      {
        to: ProductionStatus.CANCELLED,
        label: 'Cancel Batch',
        icon: XCircle,
        variant: 'destructive',
        permission: 'operations.production.cancel',
        handlerKey: 'cancel',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as ProductionBatch).status;
          return status === ProductionStatus.PLANNED;
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this production batch?',
        confirm: {
          title: 'Cancel Production Batch',
          description: (item: Record<string, unknown>) => {
            const batch = item as unknown as ProductionBatch;
            return `Cancel production batch ${batch.batchNo}? This action cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel Batch',
        },
      },
    ],
    [ProductionStatus.IN_PROGRESS]: [
      {
        to: ProductionStatus.COMPLETED,
        label: 'Complete Production',
        icon: CheckCircle,
        variant: 'default',
        permission: 'operations.production.complete',
        handlerKey: 'complete',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as ProductionBatch).status;
          return status === ProductionStatus.IN_PROGRESS;
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Mark this production batch as completed?',
        confirm: {
          title: 'Complete Production Batch',
          description: (item: Record<string, unknown>) => {
            const batch = item as unknown as ProductionBatch;
            return `Complete production batch ${batch.batchNo}?\n\nPlanned Quantity: ${batch.plannedQuantity}\n\nThis will record finished goods into inventory. Actual quantity will default to planned quantity.`;
          },
          variant: 'default',
          confirmLabel: 'Complete Production',
        },
      },
      {
        to: ProductionStatus.CANCELLED,
        label: 'Cancel Batch',
        icon: XCircle,
        variant: 'destructive',
        permission: 'operations.production.cancel',
        handlerKey: 'cancel',
        isVisible: (item: Record<string, unknown>) => {
          const status = (item as unknown as ProductionBatch).status;
          return status === ProductionStatus.IN_PROGRESS;
        },
        requiresConfirmation: true,
        confirmationMessage: () => 'Are you sure you want to cancel this in-progress batch?',
        confirm: {
          title: 'Cancel Production Batch',
          description: (item: Record<string, unknown>) => {
            const batch = item as unknown as ProductionBatch;
            return `Cancel in-progress batch ${batch.batchNo}?\n\nConsumed materials will be returned to inventory. This action cannot be undone.`;
          },
          variant: 'destructive',
          confirmLabel: 'Cancel Batch',
        },
      },
    ],
    [ProductionStatus.COMPLETED]: [],
    [ProductionStatus.CANCELLED]: [],
  },
};

export function getProductionStatusColor(status: ProductionStatus): string {
  switch (status) {
    case ProductionStatus.PLANNED:
      return 'bg-blue-100 text-blue-700';
    case ProductionStatus.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-700';
    case ProductionStatus.COMPLETED:
      return 'bg-green-100 text-green-700';
    case ProductionStatus.CANCELLED:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
