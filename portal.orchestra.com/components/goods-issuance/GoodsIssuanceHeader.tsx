import { GoodsIssuance } from '@/store/api/goodsIssuanceApi';
import { getGoodsIssuanceStatusColor, GoodsIssuanceStatus } from '@/lib/workflows/goodsIssuanceWorkflow';

export function GoodsIssuanceHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>) {
  if (!formData || !('status' in formData)) {
    return null;
  }

  const issuance = formData as unknown as GoodsIssuance;
  const statusValue = issuance.status as GoodsIssuanceStatus;
  const statusLabel = statusValue
    ? String(statusValue).charAt(0) + String(statusValue).slice(1).toLowerCase()
    : 'Unknown';
  const statusColor = getGoodsIssuanceStatusColor(statusValue);

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {statusLabel}
      </div>

      {/* CANCELLED status message */}
      {statusValue === 'CANCELLED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">This document has been cancelled and can no longer be modified.</p>
        </div>
      )}

      {/* APPROVED status message */}
      {statusValue === 'APPROVED' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">This goods issuance has been approved and stock has been deducted from the warehouse.</p>
        </div>
      )}

      {/* Reference Information */}
      {(issuance.referenceType || issuance.referenceCode) && (
        <div className="text-sm text-gray-600">
          {issuance.referenceType && <span className="font-medium">Ref Type:</span>} {issuance.referenceType}
          {issuance.referenceType && issuance.referenceCode && ' | '}
          {issuance.referenceCode && <span className="font-medium">Ref Code:</span>} {issuance.referenceCode}
        </div>
      )}
    </div>
  );
}
