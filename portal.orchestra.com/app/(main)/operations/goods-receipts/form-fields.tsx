'use client';

import { FormField, FormFieldOption } from '@/components/entity-manager/types';
import { GoodsReceiptStatus, GoodsReceiptType } from '@/store/api/goodsReceiptsApi';

interface FormFieldsContext {
  itemOptions: FormFieldOption[];
  uomOptions: FormFieldOption[];
  warehouseOptions: FormFieldOption[];
  locationOptions: FormFieldOption[];
  getLocationsByWarehouse: (warehouseId: string | number) => Promise<FormFieldOption[]>;
  currentStatus?: GoodsReceiptStatus;
}

export function getFormFields(context: FormFieldsContext): FormField[] {
  const {
    warehouseOptions,
    currentStatus,
  } = context;

  // Only DRAFT receipts are editable
  const isEditable = !currentStatus || currentStatus === GoodsReceiptStatus.DRAFT;

  const fields: FormField[] = [
    {
      name: 'receiptType',
      label: 'Receipt Type',
      type: 'select',
      required: true,
      disabled: !isEditable,
      options: [
        { value: GoodsReceiptType.PURCHASE_ORDER, label: 'Purchase Order' },
        { value: GoodsReceiptType.PRODUCTION, label: 'Production' },
        { value: GoodsReceiptType.RETURN, label: 'Return' },
        { value: GoodsReceiptType.MANUAL, label: 'Manual' },
      ],
      placeholder: 'Select receipt type',
    },
    // 🔹 Enhancement: Conditional reference fields for PURCHASE_ORDER
    {
      name: 'referenceType',
      label: 'Reference Type',
      type: 'text',
      disabled: !isEditable,
      placeholder: 'e.g., Purchase Order, Work Order',
    },
    {
      name: 'referenceCode',
      label: 'Reference Code',
      type: 'text',
      disabled: !isEditable,
      placeholder: 'e.g., PO-2024-001',
    },
    // 🔹 Enhancement: Supplier field (optional)
    {
      name: 'supplierId',
      label: 'Supplier',
      type: 'select',
      disabled: !isEditable,
      options: [], // Supplier options to be populated
      placeholder: 'Select supplier (optional)',
      description: 'Only required for Purchase Order receipts',
    },
    {
      name: 'warehouseId',
      label: 'Warehouse',
      type: 'select',
      required: true,
      disabled: !isEditable,
      options: warehouseOptions,
      placeholder: 'Select warehouse',
    },
    {
      name: 'locationId',
      label: 'Location',
      type: 'select',
      disabled: !isEditable,
      options: [], // Populated dynamically based on warehouse
      placeholder: 'Select warehouse first',
      dependsOn: 'warehouseId',
      getOptions: context.getLocationsByWarehouse ? async (dependencyValue: string | number | boolean) => {
        // Only proceed if the dependency value is a string or number (warehouse ID)
        if (typeof dependencyValue === 'boolean') return [];
        return context.getLocationsByWarehouse(dependencyValue as string | number);
      } : undefined,
    },
    {
      name: 'receiptDate',
      label: 'Receipt Date',
      type: 'date',
      required: true,
      disabled: !isEditable,
      defaultValue: new Date().toISOString().split('T')[0],
    },
    {
      name: 'expectedDate',
      label: 'Expected Date',
      type: 'date',
      disabled: !isEditable,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      disabled: !isEditable,
      placeholder: 'Enter any additional notes...',
    },
    // Items table form
    {
      name: 'items',
      label: 'Receipt Items',
      type: 'nested-array',
      required: true,
      disabled: !isEditable,
      nestedArrayConfig: {
        itemLabel: 'Item',
        itemsLabel: 'Items',
        emptyMessage: 'No items added yet. Click "Add Item" to start.',
        columns: [
          {
            key: 'itemId',
            label: 'Item',
            type: 'select',
            options: context.itemOptions,
            required: true,
          },
          {
            key: 'uomId',
            label: 'Unit of Measure',
            type: 'select',
            options: context.uomOptions,
            required: true,
          },
          {
            key: 'quantityOrdered',
            label: 'Quantity Ordered',
            type: 'number',
            required: true,
          },
          {
            key: 'quantityReceived',
            label: 'Quantity Received',
            type: 'number',
            required: true,
          },
          {
            key: 'unitPrice',
            label: 'Unit Price',
            type: 'number',
            required: true,
          },
          {
            key: 'batchNumber',
            label: 'Batch Number',
            type: 'text',
            required: false,
          },
          {
            key: 'expiryDate',
            label: 'Expiry Date',
            type: 'date',
            required: false,
          },
          {
            key: 'notes',
            label: 'Notes',
            type: 'text',
            required: false,
          },
        ],
      },
    },
    // Total value display (read-only computed field)
    {
      name: 'totalValue',
      label: 'Total Value',
      type: 'number',
      disabled: true,
      placeholder: 'Auto-calculated from items',
    },
  ];

  return fields;
}
