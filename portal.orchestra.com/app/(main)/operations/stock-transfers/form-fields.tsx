import { FormField, FormFieldOption } from "@/components/entity-manager/types";

export interface FormFieldsContext {
  warehouseOptions: FormFieldOption[];
  itemOptions: FormFieldOption[];
  getLocationsByWarehouse: (warehouseId: string | number) => Promise<FormFieldOption[]>;
  isProcessing?: boolean;
  currentStatus?: string;
}

export const getFormFields = (context: FormFieldsContext): FormField[] => {
  const { warehouseOptions, itemOptions, isProcessing, currentStatus } = context;

  const isLocked = isProcessing || (currentStatus !== undefined && currentStatus !== 'PENDING');

  const baseFields: FormField[] = [
    {
      name: "transferNumber",
      label: "Transfer Number",
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
        { value: "PENDING", label: "Pending" },
        { value: "APPROVED", label: "Approved" },
        { value: "IN_TRANSIT", label: "In Transit" },
        { value: "RECEIVED", label: "Received" },
        { value: "CANCELLED", label: "Cancelled" },
      ],
    },
    {
      name: "transferDate",
      label: "Transfer Date",
      type: "date",
      required: true,
      width: "half",
      disabled: isLocked,
    },
    {
      name: "expectedDate",
      label: "Expected Delivery Date",
      type: "date",
      required: false,
      width: "half",
      disabled: isLocked,
    },
    {
      name: "sourceWarehouseId",
      label: "Source Warehouse",
      type: "select",
      required: true,
      width: "half",
      disabled: isLocked,
      options: warehouseOptions,
    },
    {
      name: "sourceLocationId",
      label: "Source Location",
      type: "select",
      required: false,
      width: "half",
      disabled: isLocked,
      options: [],
      placeholder: "Select source warehouse first",
      dependsOn: "sourceWarehouseId",
      getOptions: async (dependencyValue: string | number | boolean) => {
        if (typeof dependencyValue === 'boolean') return [];
        return context.getLocationsByWarehouse(dependencyValue as string | number);
      },
    },
    {
      name: "destinationWarehouseId",
      label: "Destination Warehouse",
      type: "select",
      required: true,
      width: "half",
      disabled: isLocked,
      options: warehouseOptions,
    },
    {
      name: "destinationLocationId",
      label: "Destination Location",
      type: "select",
      required: false,
      width: "half",
      disabled: isLocked,
      options: [],
      placeholder: "Select destination warehouse first",
      dependsOn: "destinationWarehouseId",
      getOptions: async (dependencyValue: string | number | boolean) => {
        if (typeof dependencyValue === 'boolean') return [];
        return context.getLocationsByWarehouse(dependencyValue as string | number);
      },
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
      label: "Transfer Items",
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
            key: "quantityTransferred",
            label: "Quantity",
            type: "number",
            required: true,
            allowNegative: false,
            allowDecimal: true,
            decimalScale: 4,
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
