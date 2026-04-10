import { GoodsReceiptStatus, GoodsReceipt } from '@/store/api/goodsReceiptsApi';
import { getGoodsReceiptStatusColor } from '@/lib/workflows/goodsReceiptWorkflow';

interface GoodsReceiptHeaderProps {
  showItemsPreview?: boolean; // Add option to control items preview
}

export function GoodsReceiptHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>, props?: GoodsReceiptHeaderProps) {
  if (!formData || !('status' in formData)) {
    return null;
  }

  const receipt = formData as unknown as GoodsReceipt;
  const showItemsPreview = props?.showItemsPreview || false;
  const statusValue = receipt.status as GoodsReceiptStatus;
  const statusLabel = statusValue
    ? String(statusValue).charAt(0) + String(statusValue).slice(1).toLowerCase()
    : 'Unknown';
  const statusColor = getGoodsReceiptStatusColor(statusValue);

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {statusLabel}
      </div>

      {/* CANCELLED status message */}
      {statusValue === GoodsReceiptStatus.CANCELLED && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">This document has been cancelled and can no longer be modified.</p>
        </div>
      )}

      {/* 🔹 Enhancement: Inventory Impact Preview for DRAFT status */}
      {showItemsPreview && statusValue === GoodsReceiptStatus.DRAFT && receipt.items && receipt.items.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-800 mb-2">Inventory Impact Preview:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            {receipt.items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                {item.item?.name || `Item #${item.itemId}`}: +{item.quantityReceived} units at {receipt.warehouse?.name || `Warehouse #${receipt.warehouseId}`}
                {receipt.location?.name && ` / ${receipt.location.name}`}
              </li>
            ))}
          </ul>
          <p className="text-xs text-blue-600 mt-2">Stock will increase when confirmed</p>
        </div>
      )}

      {/* 🔹 Enhancement: Audit Info for CONFIRMED status */}
      {statusValue === GoodsReceiptStatus.CONFIRMED && (receipt.confirmedBy || receipt.confirmedAt) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800 mb-1">Confirmation Details:</p>
          <div className="text-sm text-green-700 space-y-1">
            {receipt.confirmedBy && (
              <p>Confirmed By: <span className="font-medium">User #{receipt.confirmedBy}</span></p>
            )}
            {receipt.confirmedAt && (
              <p>Confirmed At: <span className="font-medium">{new Date(receipt.confirmedAt).toLocaleString()}</span></p>
            )}
          </div>
        </div>
      )}

      {/* Reference Information */}
      {(receipt.referenceType || receipt.referenceCode) && (
        <div className="text-sm text-gray-600">
          {receipt.referenceType && <span className="font-medium">Ref Type:</span>} {receipt.referenceType}
          {receipt.referenceType && receipt.referenceCode && ' | '}
          {receipt.referenceCode && <span className="font-medium">Ref Code:</span>} {receipt.referenceCode}
        </div>
      )}
    </div>
  );
}
