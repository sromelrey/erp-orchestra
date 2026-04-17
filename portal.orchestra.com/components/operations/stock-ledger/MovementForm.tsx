"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormRenderer } from "@/components/entity-manager/FormRenderer";
import { FormField } from "@/components/entity-manager/types";
import { 
  CreateStockMovementRequest, 
  StockMovementType, 
  Item, 
  Warehouse, 
  Location, 
  ItemUom 
} from "@/types";

interface MovementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateStockMovementRequest) => Promise<boolean>;
  items: Item[];
  warehouses: Warehouse[];
  locations: Location[];
  uoms: ItemUom[];
  defaultWarehouse?: string;
}

export function MovementForm({
  open,
  onOpenChange,
  onSubmit,
  items,
  warehouses,
  locations,
  uoms,
  defaultWarehouse,
}: MovementFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => ({
    movementType: StockMovementType.RECEIPT,
    itemId: "",
    uomId: "",
    quantity: 1,
    warehouseId: defaultWarehouse || "",
    locationId: "",
    destinationWarehouseId: "",
    destinationLocationId: "",
    referenceType: "",
    referenceCode: "",
    memo: "",
    documentDate: new Date().toISOString().split('T')[0],
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Batch related state into a single object to avoid multiple renders
  const [formState, setFormState] = useState({
    selectedMovementType: StockMovementType.RECEIPT,
    selectedWarehouse: defaultWarehouse || "",
    selectedDestinationWarehouse: "",
    documentDate: new Date().toISOString().split('T')[0],
  });

  // Derive selected item from formData.itemId instead of storing it in state
  const selectedItem = formData.itemId 
    ? items.find(i => i.id.toString() === formData.itemId as string) || null
    : null;

  // Reset form when dialog opens - use a key to force re-render instead of effect
  const formKey = open ? `form-${open}-${defaultWarehouse}` : 'form-closed';

  // Get form fields based on movement type
  const getFormFields = (): FormField[] => {
    const baseFields: FormField[] = [
      {
        name: "movementType",
        label: "Movement Type",
        type: "select",
        required: true,
        options: [
          { label: "Receipt", value: StockMovementType.RECEIPT },
          { label: "Transfer", value: StockMovementType.TRANSFER },
          { label: "Adjustment", value: StockMovementType.ADJUSTMENT },
          { label: "Pick", value: StockMovementType.PICK },
          { label: "Pack", value: StockMovementType.PACK },
          { label: "Ship", value: StockMovementType.SHIP },
          { label: "Return", value: StockMovementType.RETURN },
          { label: "Damage", value: StockMovementType.DAMAGE },
          { label: "Expire", value: StockMovementType.EXPIRE },
        ],
      },
      {
        name: "itemId",
        label: "Item",
        type: "select",
        required: true,
        options: items.map(item => ({
          label: `${item.code} - ${item.name}`,
          value: item.id.toString(),
        })),
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: true,
        placeholder: "0.00",
      },
      {
        name: "uomId",
        label: "Unit of Measure",
        type: "select",
        required: true,
        options: uoms.map(uom => ({
          label: `${uom.code} - ${uom.name}`,
          value: uom.id.toString(),
        })),
        disabled: !!selectedItem, // Disable if item is selected
      },
    ];

    // Add warehouse/location fields based on movement type
    if (formState.selectedMovementType === StockMovementType.TRANSFER) {
      baseFields.push(
        {
          name: "sourceWarehouse",
          label: "Source Warehouse",
          type: "select",
          required: true,
          options: warehouses.map(wh => ({
            label: `${wh.code} - ${wh.name}`,
            value: wh.id,
          })),
        },
        {
          name: "sourceLocation",
          label: "Source Location (optional)",
          type: "select",
          options: locations
            .filter(l => l.warehouseId === formState.selectedWarehouse)
            .map(loc => ({
              label: `${loc.code} - ${loc.name}`,
              value: loc.id,
            })),
        },
        {
          name: "destinationWarehouse",
          label: "Destination Warehouse",
          type: "select",
          required: true,
          options: warehouses
            .filter(w => w.id !== formState.selectedWarehouse)
            .map(wh => ({
              label: `${wh.code} - ${wh.name}`,
              value: wh.id,
            })),
        },
        {
          name: "destinationLocation",
          label: "Destination Location (optional)",
          type: "select",
          options: locations
            .filter(l => l.warehouseId === formState.selectedDestinationWarehouse)
            .map(loc => ({
              label: `${loc.code} - ${loc.name}`,
              value: loc.id,
            })),
        }
      );
    } else {
      const requiresSource = [
        StockMovementType.PICK,
        StockMovementType.PACK,
        StockMovementType.SHIP,
        StockMovementType.DAMAGE,
        StockMovementType.EXPIRE,
      ].includes(formState.selectedMovementType);

      baseFields.push(
        {
          name: "warehouseId",
          label: requiresSource ? "Source Warehouse" : "Destination Warehouse",
          type: "select",
          required: true,
          options: warehouses.map(wh => ({
            label: `${wh.code} - ${wh.name}`,
            value: wh.id,
          })),
        },
        {
          name: "locationId",
          label: "Location (optional)",
          type: "select",
          options: locations
            .filter(l => l.warehouseId === formState.selectedWarehouse)
            .map(loc => ({
              label: `${loc.code} - ${loc.name}`,
              value: loc.id,
            })),
        }
      );
    }

    // Add reference fields
    baseFields.push(
      {
        name: "referenceType",
        label: "Reference Type (optional)",
        type: "text",
        placeholder: "e.g., PO, SO, ADJ",
      },
      {
        name: "referenceCode",
        label: "Reference No (optional)",
        type: "text",
        placeholder: "e.g., PO-2026-001",
      }
    );

    // Add remarks
    baseFields.push({
      name: "memo",
      label: "Remarks (optional)",
      type: "textarea",
      placeholder: "Add any additional notes...",
    });

    return baseFields;
  };

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "movementType") {
      setFormState(prev => ({ ...prev, selectedMovementType: value as StockMovementType }));
    } else if (name === "warehouseId") {
      setFormState(prev => ({ ...prev, selectedWarehouse: value as string }));
    } else if (name === "destinationWarehouse") {
      setFormState(prev => ({ ...prev, selectedDestinationWarehouse: value as string }));
    } else if (name === "itemId") {
      // Auto-set UOM when item is selected
      const item = items.find(i => i.id.toString() === value as string);
      if (item) {
        setFormData(prev => ({ ...prev, uomId: item.baseUomId.toString() }));
      }
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.movementType || !formData.itemId || !formData.quantity || !formData.uomId) {
      alert("Please fill in all required fields");
      return;
    }

    if (formState.selectedMovementType === StockMovementType.TRANSFER) {
      if (!formData.sourceWarehouse || !formData.destinationWarehouse) {
        alert("Transfer requires both source and destination warehouses");
        return;
      }
      if (formData.sourceWarehouse === formData.destinationWarehouse) {
        alert("Source and destination warehouses must be different");
        return;
      }
    }

    setIsSubmitting(true);
    
    const request: CreateStockMovementRequest = {
      movementType: formData.movementType as StockMovementType,
      itemId: formData.itemId as string,
      uomId: formData.uomId as string,
      quantity: parseFloat(formData.quantity as string),
      warehouseId: formState.selectedMovementType === StockMovementType.TRANSFER 
        ? formData.destinationWarehouse as string
        : formData.warehouseId as string,
      locationId: formState.selectedMovementType === StockMovementType.TRANSFER
        ? (formData.destinationLocation as string | undefined)
        : (formData.locationId as string | undefined),
      referenceType: formData.referenceType as string | undefined,
      referenceCode: formData.referenceCode as string | undefined,
      memo: formData.memo as string | undefined,
      documentDate: formState.documentDate ? new Date(formState.documentDate).toISOString() : undefined,
    };

    const success = await onSubmit(request);
    setIsSubmitting(false);
    
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Stock Movement</DialogTitle>
          <DialogDescription>
            Create a new stock movement transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Date */}
          <div>
            <label className="text-sm font-medium">Document Date</label>
            <Input
              type="date"
              value={formState.documentDate}
              onChange={(e) => setFormState(prev => ({ ...prev, documentDate: e.target.value }))}
              className="mt-2"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Form Fields */}
          <FormRenderer
            key={formKey}
            fields={getFormFields()}
            formData={formData as Record<string, string | number | boolean | unknown[] | undefined>}
            formMode="create"
            onFieldChange={handleFieldChange}
          />
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Record Movement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
