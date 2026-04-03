import { FormField } from "@/components/entity-manager/types";
import { StockMovementType } from "@/types";

// Basic form fields structure - options will be injected dynamically in movements-tab.tsx
export const baseFormFields: FormField[] = [
  {
    name: "documentDate",
    label: "Document Date",
    type: "date",
    required: false,
    width: "half",
  },
  {
    name: "movementType",
    label: "Movement Type",
    type: "select",
    required: true,
    width: "half",
    options: [
      { value: StockMovementType.RECEIPT, label: "Receipt" },
      { value: StockMovementType.TRANSFER, label: "Transfer" },
      { value: StockMovementType.ADJUSTMENT, label: "Adjustment" },
      { value: StockMovementType.PICK, label: "Pick" },
      { value: StockMovementType.PACK, label: "Pack" },
      { value: StockMovementType.SHIP, label: "Ship" },
      { value: StockMovementType.RETURN, label: "Return" },
      { value: StockMovementType.DAMAGE, label: "Damage" },
      { value: StockMovementType.EXPIRE, label: "Expire" },
    ],
  },
  {
    name: "itemId",
    label: "Item",
    type: "select",
    required: true,
    width: "full",
    options: [], // Will be injected dynamically
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    required: true,
    width: "half",
    placeholder: "0.00",
  },
  {
    name: "uomId",
    label: "Unit of Measure",
    type: "select",
    required: true,
    width: "half",
    options: [], // Will be injected dynamically
  },
  {
    name: "warehouseId",
    label: "Warehouse",
    type: "select",
    required: true,
    width: "full",
    options: [], // Will be injected dynamically
  },
  {
    name: "locationId",
    label: "Location",
    type: "select",
    required: false,
    width: "full",
    options: [], // Will be injected dynamically
  },
  {
    name: "referenceType",
    label: "Reference Type",
    type: "text",
    required: false,
    width: "half",
    placeholder: "e.g., PO, SO, ADJ",
  },
  {
    name: "referenceCode",
    label: "Reference No",
    type: "text",
    required: false,
    width: "half",
    placeholder: "e.g., PO-2026-001",
  },
  {
    name: "memo",
    label: "Remarks",
    type: "textarea",
    required: false,
    width: "full",
    placeholder: "Add any additional notes...",
  },
];
