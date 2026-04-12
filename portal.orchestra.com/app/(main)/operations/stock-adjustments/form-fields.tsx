import { FormField, FormFieldOption } from "@/components/entity-manager/types";

export type AdjustmentType = 'DAMAGE' | 'LOSS' | 'FOUND' | 'COUNT';

export interface StockAdjustmentItem {
  itemId: number;
  quantityAdjusted: number;
  unitCost?: number;
  totalCost?: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface FormFieldsContext {
  warehouseOptions: FormFieldOption[];
  locationOptions: FormFieldOption[];
  itemOptions: FormFieldOption[];
  getLocationsByWarehouse: (warehouseId: string | number) => Promise<FormFieldOption[]>;
  isProcessing?: boolean;
  currentStatus?: string;
}

export const getFormFields = (context: FormFieldsContext): FormField[] => {
  const { warehouseOptions, itemOptions, isProcessing, currentStatus } = context;

  const isLocked = isProcessing || (currentStatus !== undefined && currentStatus !== 'DRAFT');

  const baseFields: FormField[] = [
    {
      name: "adjustmentNumber",
      label: "Adjustment Number",
      type: "text",
      required: false,
      width: "half",
      disabled: true,
      placeholder: "Auto-generated",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: false,
      width: "half",
      disabled: true,
      options: [
        { value: "DRAFT", label: "Draft" },
        { value: "APPROVED", label: "Approved" },
        { value: "CANCELLED", label: "Cancelled" },
      ],
    },
    {
      name: "adjustmentDate",
      label: "Adjustment Date",
      type: "date",
      required: true,
      width: "half",
      disabled: isLocked,
    },
    {
      name: "adjustmentType",
      label: "Adjustment Type",
      type: "select",
      required: true,
      width: "half",
      disabled: isLocked,
      options: [
        { value: "DAMAGE", label: "Damage (Stock Decrease)" },
        { value: "LOSS", label: "Loss (Stock Decrease)" },
        { value: "FOUND", label: "Found (Stock Increase)" },
        { value: "COUNT", label: "Stock Count" },
      ],
    },
    {
      name: "warehouseId",
      label: "Warehouse",
      type: "select",
      required: true,
      width: "half",
      disabled: isLocked,
      options: warehouseOptions,
    },
    {
      name: "locationId",
      label: "Location",
      type: "select",
      required: false,
      width: "half",
      disabled: isLocked,
      options: [],
      placeholder: 'Select warehouse first',
      dependsOn: "warehouseId",
      getOptions: async (dependencyValue: string | number | boolean) => {
        if (typeof dependencyValue === 'boolean') return [];
        return context.getLocationsByWarehouse(dependencyValue as string | number);
      },
    },
    {
      name: "referenceType",
      label: "Reference Type",
      type: "text",
      required: false,
      width: "half",
      disabled: isLocked,
      placeholder: "e.g., PO, SO, ADJ",
    },
    {
      name: "referenceId",
      label: "Reference ID",
      type: "number",
      required: false,
      width: "half",
      disabled: isLocked,
      placeholder: "e.g., 12345",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      required: false,
      width: "full",
      disabled: isLocked,
      placeholder: "Add any additional notes...",
    },
    {
      name: "items",
      label: "Adjustment Items",
      type: "nested-array",
      required: true,
      disabled: isLocked,
      nestedArrayConfig: {
        itemLabel: "Item",
        itemsLabel: "Items",
        emptyMessage: "No items added yet. Click 'Add Item' to start.",
        columns: [
          {
            key: "itemId",
            label: "Item",
            type: "select",
            options: itemOptions,
            required: true,
          },
          {
            key: "quantityAdjusted",
            label: "Quantity Adjusted",
            type: "number",
            required: true,
            allowNegative: true,
            allowDecimal: false,
          },
          {
            key: "unitCost",
            label: "Unit Cost",
            type: "number",
            allowNegative: false,
            allowDecimal: true,
            decimalScale: 4,
          },
          {
            key: "totalCost",
            label: "Total Cost",
            type: "number",
            allowNegative: false,
            allowDecimal: true,
            decimalScale: 4,
          },
          {
            key: "batchNumber",
            label: "Batch Number",
            type: "text",
          },
          {
            key: "expiryDate",
            label: "Expiry Date",
            type: "date",
          },
          {
            key: "notes",
            label: "Item Notes",
            type: "text",
          },
        ],
      },
    },
  ];

  return baseFields;
};
