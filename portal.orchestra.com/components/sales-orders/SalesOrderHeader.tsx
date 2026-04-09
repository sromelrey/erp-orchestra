import { SalesOrderStatus } from '@/store/api/salesOrdersApi';
import { getSalesOrderStatusColor } from '@/lib/workflows/salesOrderWorkflow';

export function SalesOrderHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>) {
  if (!formData || !('status' in formData)) return null;

  const statusValue = formData.status as SalesOrderStatus;
  const statusLabel = statusValue
    ? String(statusValue).charAt(0) + String(statusValue).slice(1).toLowerCase()
    : 'Unknown';
  const statusColor = getSalesOrderStatusColor(statusValue);

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
      {statusLabel}
    </div>
  );
}
