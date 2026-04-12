import { StockTransfer } from '@/store/api/stockTransfersApi';
import { getStockTransferStatusColor, StockTransferStatus } from '@/lib/workflows/stockTransferWorkflow';

export function StockTransferHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>) {
  if (!formData || !('status' in formData)) {
    return null;
  }

  const transfer = formData as unknown as StockTransfer;
  const statusValue = transfer.status as StockTransferStatus;
  const statusLabel = statusValue
    ? String(statusValue).charAt(0) + String(statusValue).slice(1).toLowerCase().replace('_', ' ')
    : 'Unknown';
  const statusColor = getStockTransferStatusColor(statusValue);

  return (
    <div className="space-y-3">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {statusLabel}
      </div>

      {statusValue === 'CANCELLED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">This transfer has been cancelled and can no longer be modified.</p>
        </div>
      )}

      {statusValue === 'APPROVED' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">This transfer has been approved and is ready for shipment.</p>
        </div>
      )}

      {statusValue === 'IN_TRANSIT' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-700">This transfer is currently in transit.</p>
        </div>
      )}

      {statusValue === 'RECEIVED' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">This transfer has been received and stock levels have been updated.</p>
        </div>
      )}
    </div>
  );
}
