import { StockAdjustment } from '@/store/api/stockAdjustmentsApi';
import { getStockAdjustmentStatusColor, StockAdjustmentStatus } from '@/lib/workflows/stockAdjustmentWorkflow';

export function StockAdjustmentHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>) {
  if (!formData || !('status' in formData)) {
    return null;
  }

  const adjustment = formData as unknown as StockAdjustment;
  const statusValue = adjustment.status as StockAdjustmentStatus;
  const statusLabel = statusValue
    ? String(statusValue).charAt(0) + String(statusValue).slice(1).toLowerCase()
    : 'Unknown';
  const statusColor = getStockAdjustmentStatusColor(statusValue);

  return (
    <div className="space-y-3">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {statusLabel}
      </div>

      {statusValue === 'CANCELLED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">This adjustment has been cancelled and can no longer be modified.</p>
        </div>
      )}

      {statusValue === 'APPROVED' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">This stock adjustment has been approved and stock levels have been updated.</p>
        </div>
      )}

      {adjustment.adjustmentNumber && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Adjustment #:</span> {adjustment.adjustmentNumber}
          {adjustment.adjustmentType && (
            <span className="ml-3">
              <span className="font-medium">Type:</span> {adjustment.adjustmentType}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
