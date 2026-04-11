import { ProductionStatus, ProductionBatch } from '@/store/api/productionApi';
import { getProductionStatusColor } from '@/lib/workflows/productionWorkflow';

export function ProductionHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>) {
  if (!formData || !('status' in formData)) {
    return null;
  }

  const batch = formData as unknown as ProductionBatch;
  const statusValue = batch.status as ProductionStatus;
  const statusLabel = statusValue
    ? String(statusValue)
        .replace('_', ' ')
        .charAt(0)
        .toUpperCase() + String(statusValue).replace('_', ' ').slice(1).toLowerCase()
    : 'Unknown';
  const statusColor = getProductionStatusColor(statusValue);

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {statusLabel}
      </div>

      {/* CANCELLED status message */}
      {statusValue === ProductionStatus.CANCELLED && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">This batch has been cancelled and can no longer be modified.</p>
        </div>
      )}

      {/* COMPLETED status message */}
      {statusValue === ProductionStatus.COMPLETED && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">
            Production complete.
            {batch.actualQuantity !== undefined && batch.actualQuantity !== null && (
              <> Actual quantity produced: <span className="font-medium">{batch.actualQuantity}</span></>
            )}
          </p>
        </div>
      )}

      {/* IN_PROGRESS message */}
      {statusValue === ProductionStatus.IN_PROGRESS && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-700">
            Production is in progress. Planned quantity: <span className="font-medium">{batch.plannedQuantity}</span>
          </p>
        </div>
      )}

      {/* BOM Info */}
      {batch.bom && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">BOM:</span>{' '}
          {batch.bom.parentMaterial?.name || `BOM #${batch.bomId}`}
        </div>
      )}

      {/* Batch dates */}
      {(batch.startDate || batch.endDate) && (
        <div className="text-sm text-gray-600 flex gap-4">
          {batch.startDate && (
            <span>
              <span className="font-medium">Start:</span>{' '}
              {new Date(batch.startDate).toLocaleDateString()}
            </span>
          )}
          {batch.endDate && (
            <span>
              <span className="font-medium">End:</span>{' '}
              {new Date(batch.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
