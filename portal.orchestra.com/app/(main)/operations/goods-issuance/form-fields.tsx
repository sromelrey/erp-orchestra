import { FormField, FormFieldOption } from "@/components/entity-manager/types";
import { GoodsIssuance } from "@/store/api/goodsIssuanceApi";

export interface FormFieldsContext {
  warehouseOptions: FormFieldOption[];
  locationOptions: FormFieldOption[];
  itemOptions: FormFieldOption[];
  uomOptions: FormFieldOption[];
  departmentOptions: FormFieldOption[];
  getLocationsByWarehouse: (warehouseId: string | number) => Promise<FormFieldOption[]>;
  isProcessing?: boolean;
  currentOpenItem?: GoodsIssuance | null;
}

export const getFormFields = (context: FormFieldsContext): FormField[] => {
  const { warehouseOptions, itemOptions, uomOptions, departmentOptions, isProcessing, currentOpenItem } = context;

  const isEditable = !currentOpenItem || currentOpenItem.status === 'DRAFT';

  const baseFields: FormField[] = [
    // === Status Field (Always at top) ===
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      width: 'full',
      disabled: true,
      options: [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
    },
    // === 1. System Section ===
    {
      name: "issuanceNumber",
      label: "Issuance Number",
      type: "text",
      required: false,
      width: "half",
      disabled: true,
      placeholder: "Auto-generated",
    },
    {
      name: "issuanceType",
      label: "Issuance Type",
      type: "select",
      required: true,
      width: "half",
      disabled: isProcessing || !isEditable,
      options: [
        { value: "PRODUCTION", label: "Production" },
        { value: "SALES", label: "Sales" },
        { value: "TRANSFER", label: "Transfer" },
        { value: "ADJUSTMENT", label: "Adjustment" },
      ],
    },
    // === 2. Reference Section ===
    {
      name: "referenceType",
      label: "Reference Type",
      type: "text",
      required: false,
      width: "half",
      disabled: isProcessing || !isEditable,
      placeholder: "e.g., PO, SO, PROD",
    },
    {
      name: "referenceCode",
      label: "Reference Code",
      type: "text",
      required: false,
      width: "half",
      disabled: isProcessing || !isEditable,
      placeholder: "e.g., PO-2026-001",
    },
    {
      name: "issuedToDepartmentId",
      label: "Issued To Department",
      type: "select",
      required: false,
      width: "full",
      disabled: isProcessing || !isEditable,
      options: departmentOptions,
    },
    // === 3. Location Section ===
    {
      name: "warehouseId",
      label: "Warehouse",
      type: "select",
      required: true,
      width: "half",
      disabled: isProcessing || !isEditable,
      options: warehouseOptions,
    },
    {
      name: "locationId",
      label: "Location",
      type: "select",
      required: false,
      width: "half",
      disabled: isProcessing || !isEditable,
      options: [],
      placeholder: 'Select warehouse first',
      dependsOn: "warehouseId",
      getOptions: async (dependencyValue: string | number | boolean) => {
        if (typeof dependencyValue === 'boolean') return [];
        return context.getLocationsByWarehouse(dependencyValue as string | number);
      },
    },
    // === 4. Dates & Notes Section ===
    {
      name: "issuanceDate",
      label: "Issuance Date",
      type: "date",
      required: true,
      width: "half",
      disabled: isProcessing || !isEditable,
    },
    {
      name: "expectedDate",
      label: "Expected Date",
      type: "date",
      required: false,
      width: "half",
      disabled: isProcessing || !isEditable,
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      required: false,
      width: "full",
      disabled: isProcessing || !isEditable,
      placeholder: "Add any additional notes...",
    },
    // === 5. Items Section (Main) ===
    {
      name: "items",
      label: "Issuance Items",
      type: "nested-array",
      required: true,
      disabled: isProcessing || !isEditable,
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
            key: "uomId",
            label: "Unit of Measure",
            type: "select",
            options: uomOptions,
            required: true,
          },
          {
            key: "quantityIssued",
            label: "Quantity Issued",
            type: "number",
            required: true,
          },
          {
            key: "unitPrice",
            label: "Unit Price",
            type: "number",
          },
          {
            key: "totalPrice",
            label: "Total Price",
            type: "number",
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
