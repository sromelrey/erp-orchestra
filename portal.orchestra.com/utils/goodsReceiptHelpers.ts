import { CreateGoodsReceiptRequest, UpdateGoodsReceiptRequest, CreateGoodsReceiptItemRequest } from '@/store/api/goodsReceiptsApi';

export interface ValidationError {
  field: string;
  message: string;
}

export interface TransformedGoodsReceiptItem {
  itemId: number;
  uomId: number;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

/**
 * 🔹 Enhancement: Validate quantity rules for a single item
 * Returns array of validation errors
 */
export function validateGoodsReceiptItem(item: Record<string, unknown>, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const quantityReceived = Number(item.quantityReceived ?? 0);
  const quantityOrdered = Number(item.quantityOrdered ?? 0);

  // quantityReceived > 0
  if (quantityReceived <= 0) {
    errors.push({
      field: `items[${index}].quantityReceived`,
      message: 'Quantity received must be greater than 0',
    });
  }

  // If quantityOrdered exists: quantityReceived <= quantityOrdered
  if (quantityOrdered > 0 && quantityReceived > quantityOrdered) {
    errors.push({
      field: `items[${index}].quantityReceived`,
      message: `Quantity received (${quantityReceived}) cannot exceed quantity ordered (${quantityOrdered})`,
    });
  }

  // Prevent negative numbers
  if (quantityReceived < 0) {
    errors.push({
      field: `items[${index}].quantityReceived`,
      message: 'Quantity received cannot be negative',
    });
  }

  return errors;
}

/**
 * 🔹 Enhancement: Check for duplicate items based on itemId + warehouseId + locationId
 * Returns array of duplicate indices
 */
export function findDuplicateItems(
  items: Record<string, unknown>[],
  warehouseId: string | number
): Array<{ index: number; duplicateOf: number }> {
  const duplicates: Array<{ index: number; duplicateOf: number }> = [];
  const seen = new Map<string, number>();

  items.forEach((item, index) => {
    const itemId = String(item.itemId);
    const locationId = String(item.locationId ?? 'null');
    const key = `${itemId}-${warehouseId}-${locationId}`;

    if (seen.has(key)) {
      duplicates.push({ index, duplicateOf: seen.get(key)! });
    } else {
      seen.set(key, index);
    }
  });

  return duplicates;
}

/**
 * 🔹 Enhancement: Merge duplicate items by summing quantities
 */
export function mergeDuplicateItems(items: Record<string, unknown>[]): Record<string, unknown>[] {
  const merged = new Map<string, Record<string, unknown>>();

  items.forEach((item) => {
    const itemId = String(item.itemId);
    const locationId = String(item.locationId ?? 'null');
    const key = `${itemId}-${locationId}`;

    if (merged.has(key)) {
      const existing = merged.get(key)!;
      const existingQty = Number(existing.quantityReceived ?? 0);
      const newQty = Number(item.quantityReceived ?? 0);
      existing.quantityReceived = existingQty + newQty;

      // Recalculate total price if unitPrice exists
      const unitPrice = Number(existing.unitPrice ?? 0);
      if (unitPrice > 0) {
        existing.totalPrice = (existingQty + newQty) * unitPrice;
      }
    } else {
      merged.set(key, { ...item });
    }
  });

  return Array.from(merged.values());
}

/**
 * Transform form items to API format with validation
 */
export function transformGoodsReceiptItems(
  items: Record<string, unknown>[],
  warehouseId: string | number
): { transformed: TransformedGoodsReceiptItem[]; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // 🔹 Enhancement: Check for duplicates
  const duplicates = findDuplicateItems(items, warehouseId);
  if (duplicates.length > 0) {
    duplicates.forEach((dup) => {
      errors.push({
        field: `items[${dup.index}].itemId`,
        message: `Duplicate item at row ${dup.index + 1} (same as row ${dup.duplicateOf + 1}). Please merge or remove duplicates.`,
      });
    });
  }

  const transformed = items.map((item, index) => {
    // 🔹 Enhancement: Validate each item
    const itemErrors = validateGoodsReceiptItem(item, index);
    errors.push(...itemErrors);

    const quantityOrdered = Number(item.quantityOrdered ?? 0);
    const quantityReceived = Number(item.quantityReceived ?? quantityOrdered);
    const unitPrice = Number(item.unitPrice ?? 0);
    const totalPrice = unitPrice > 0 ? quantityReceived * unitPrice : Number(item.totalPrice ?? 0);

    return {
      itemId: Number(item.itemId),
      uomId: Number(item.uomId),
      quantityOrdered,
      quantityReceived,
      unitPrice,
      totalPrice,
      batchNumber: item.batchNumber as string | undefined,
      expiryDate: item.expiryDate as string | undefined,
      notes: item.notes as string | undefined,
    };
  });

  return { transformed, errors };
}

/**
 * 🔹 Enhancement: Calculate line total for an item
 */
export function calculateLineTotal(item: Record<string, unknown>): number {
  const quantityReceived = Number(item.quantityReceived ?? 0);
  const unitPrice = Number(item.unitPrice ?? 0);
  return quantityReceived * unitPrice;
}

/**
 * 🔹 Enhancement: Calculate total receipt value from items
 */
export function calculateTotalReceiptValue(items: Record<string, unknown>[]): number {
  return items.reduce((total, item) => total + calculateLineTotal(item), 0);
}

/**
 * Format form data for create goods receipt API call
 */
export function formatGoodsReceiptForCreate(
  formData: Partial<CreateGoodsReceiptRequest>
): { data: CreateGoodsReceiptRequest; errors: ValidationError[] } {
  const items = (formData.items ?? []) as unknown as Record<string, unknown>[];
  const warehouseId = formData.warehouseId ?? 0;

  // 🔹 Enhancement: Transform and validate items
  const { transformed, errors } = transformGoodsReceiptItems(items, warehouseId);

  // 🔹 Enhancement: Validate reference fields
  if (formData.referenceType && !formData.referenceCode) {
    errors.push({
      field: 'referenceCode',
      message: 'Reference code is required when reference type is provided',
    });
  }

  const data: CreateGoodsReceiptRequest = {
    receiptType: formData.receiptType!,
    referenceType: formData.referenceType,
    referenceCode: formData.referenceCode,
    supplierId: formData.supplierId ? Number(formData.supplierId) : undefined,
    warehouseId: Number(formData.warehouseId),
    locationId: formData.locationId ? Number(formData.locationId) : undefined,
    receiptDate: formData.receiptDate || new Date().toISOString().split('T')[0],
    expectedDate: formData.expectedDate,
    notes: formData.notes,
    items: transformed,
  };

  return { data, errors };
}

/**
 * Format form data for update goods receipt API call
 */
export function formatGoodsReceiptForUpdate(
  formData: Partial<UpdateGoodsReceiptRequest>
): Partial<UpdateGoodsReceiptRequest> {
  return {
    referenceType: formData.referenceType,
    referenceCode: formData.referenceCode,
    supplierId: formData.supplierId ? Number(formData.supplierId) : undefined,
    warehouseId: formData.warehouseId ? Number(formData.warehouseId) : undefined,
    locationId: formData.locationId ? Number(formData.locationId) : undefined,
    receiptDate: formData.receiptDate,
    expectedDate: formData.expectedDate,
    notes: formData.notes,
  };
}

/**
 * 🔹 Enhancement: Format inventory impact preview for display
 */
export function formatInventoryImpactPreview(
  items: Array<{ itemName?: string; warehouseName?: string; locationName?: string; quantityReceived?: number }>
): string {
  if (items.length === 0) return 'No items to receive.';

  const lines = items.map((item) => {
    const qty = item.quantityReceived ?? 0;
    const name = item.itemName ?? 'Unknown Item';
    const warehouse = item.warehouseName ?? 'Unknown Warehouse';
    const location = item.locationName ?? 'Default Location';
    return `• ${name}: +${qty} units at ${warehouse} / ${location}`;
  });

  return `The following inventory will be added:\n${lines.join('\n')}`;
}
