import { CreateSalesOrderRequest, UpdateSalesOrderRequest } from '@/store/api/salesOrdersApi';

export interface TransformedSalesOrderItem {
  itemId: number;
  quantity: number;
  unitPrice: number;
  unitOfMeasureId: number;
  warehouseId: number;
  locationId: number;
  discountPercent: number;
  taxPercent: number;
  notes?: string;
}

/**
 * Transform form items to API format
 */
export function transformSalesOrderItems(items: Record<string, unknown>[]): TransformedSalesOrderItem[] {
  return items.map((item) => ({
    itemId: Number(item.itemId),
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    unitOfMeasureId: Number(item.unitOfMeasureId),
    warehouseId: Number(item.warehouseId),
    locationId: Number(item.locationId),
    discountPercent: Number(item.discountPercent ?? 0),
    taxPercent: Number(item.taxPercent ?? 0),
    notes: item.notes as string | undefined,
  }));
}

/**
 * Format form data for create sales order API call
 */
export function formatSalesOrderForCreate(formData: Partial<CreateSalesOrderRequest>): CreateSalesOrderRequest {
  const transformedItems = transformSalesOrderItems((formData.items ?? []) as unknown as Record<string, unknown>[]);

  return {
    customerName: formData.customerName || '',
    orderDate: formData.orderDate || new Date().toISOString().split('T')[0],
    deliveryDate: formData.deliveryDate,
    notes: formData.notes,
    items: transformedItems,
  };
}

/**
 * Format form data for update sales order API call
 */
export function formatSalesOrderForUpdate(formData: Partial<UpdateSalesOrderRequest>): Partial<UpdateSalesOrderRequest> {
  return {
    customerName: formData.customerName,
    deliveryDate: formData.deliveryDate,
    notes: formData.notes,
    discountAmount: formData.discountAmount,
    taxAmount: formData.taxAmount,
  };
}
