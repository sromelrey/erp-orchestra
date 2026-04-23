'use client';

import { SalesOrder, SalesOrderItem } from '@/store/api/salesOrdersApi';

interface SalesOrderExpandedRowProps {
  order: SalesOrder;
}

export function SalesOrderExpandedRow({ order }: SalesOrderExpandedRowProps) {
  if (!order.items || order.items.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4">
        No items in this order
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Items Table */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-3">Order Items</h4>
        <div className="rounded-lg border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 text-xs font-medium text-gray-600">Service Code</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Service Type</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Service Option</th>
                <th className="text-right p-3 text-xs font-medium text-gray-600">Quantity</th>
                <th className="text-right p-3 text-xs font-medium text-gray-600">Unit Price</th>
                <th className="text-right p-3 text-xs font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: SalesOrderItem, index: number) => (
                <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 text-sm">{item.itemCode || '-'}</td>
                  <td className="p-3 text-sm">{item.itemName || '-'}</td>
                  <td className="p-3 text-sm">{item.serviceOption?.name || '-'}</td>
                  <td className="p-3 text-sm text-right">{Number(item.quantity).toFixed(2)}</td>
                  <td className="p-3 text-sm text-right">${Number(item.unitPrice || 0).toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-medium">
                    ${((item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block text-xs">Subtotal</span>
          <span className="font-medium">₱{order.totalAmount || '0.00'}</span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs">Discount</span>
          <span className="font-medium text-red-600">
            {order.discountAmount ? `-₱${order.discountAmount}` : '-'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs">Tax</span>
          <span className="font-medium text-green-600">
            {order.taxAmount ? `+₱${order.taxAmount}` : '-'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs">Final Amount</span>
          <span className="font-bold">₱{order.finalAmount || '0.00'}</span>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Notes</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
