"use client";

 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { columns } from "@/app/(main)/operations/stock-ledger/column";
import { baseFormFields } from "@/app/(main)/operations/stock-ledger/form-fields";
import { useStockLedger } from "@/hooks/operations/useStockLedger";
import { EntityManager } from "@/components/entity-manager";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Activity } from "lucide-react";
import { CreateStockMovementRequest, StockMovementType, StockLedgerEntry } from "@/types/operations";
import { useMemo, useState } from "react";
import { useGetLocationsQuery } from "@/store/api";


export function MovementsTab() {
  const {
    data,
    items,
    warehouses,
    uoms,
    isLoading,
    handleCreateMovement,
    handleUpdate,
    handleDelete,
  } = useStockLedger();

  // Track warehouse selection in the form
  const [formWarehouseId, setFormWarehouseId] = useState<string | undefined>();
  
  // Fetch locations for the selected warehouse in the form
  const { data: formLocations = [], isLoading: formLocationsLoading, error: locationsError } = useGetLocationsQuery(
    { warehouseId: formWarehouseId || '' },
    { 
      skip: !formWarehouseId,
      // Force refetch when warehouseId changes
      refetchOnMountOrArgChange: true
    }
  );
  
  // Log API call status
  console.log("useGetLocationsQuery:", { 
    warehouseId: formWarehouseId, 
    isLoading: formLocationsLoading, 
    dataCount: formLocations.length,
    error: locationsError
  });
  
  // Wrapper function to handle type conversion
  const handleCreate = async (data: Partial<StockLedgerEntry>) => {
    // Validate required fields
    if (!data.itemId) {
      throw new Error("Item is required");
    }
    if (!data.uomId) {
      throw new Error("UOM is required");
    }
    if (data.quantity === undefined || data.quantity === null) {
      throw new Error("Quantity is required");
    }
    if (!data.movementType) {
      throw new Error("Movement type is required");
    }
    if (!data.warehouseId) {
      throw new Error("Warehouse is required");
    }

    const apiRequest: CreateStockMovementRequest = {
      itemId: String(data.itemId),
      quantity: typeof data.quantity === 'string' ? parseFloat(data.quantity) : Number(data.quantity),
      uomId: String(data.uomId),
      warehouseId: String(data.warehouseId),
      movementType: data.movementType as StockMovementType,
      locationId: data.locationId ? String(data.locationId) : undefined,
      referenceType: data.referenceType || undefined,
      referenceCode: data.referenceCode || undefined,
      memo: data.memo || undefined,
      documentDate: data.documentDate ? new Date(data.documentDate).toISOString() : undefined,
    };

    await handleCreateMovement(apiRequest);
  };

  // Inject dynamic options into form fields
  const formFields = useMemo(() => {
    const itemOptions = items.map(item => ({
      value: item.id.toString(),
      label: `${item.code} - ${item.name}`
    }));
    
    const warehouseOptions = warehouses.map(warehouse => ({
      value: warehouse.id.toString(),
      label: `${warehouse.code} - ${warehouse.name}`
    }));
    
    const uomOptions = uoms.map(uom => ({
      value: uom.id.toString(),
      label: `${uom.code} - ${uom.name}`
    }));

    const locationOptions = formLocations.map(location => ({
      value: location.id.toString(),
      label: `${location.code} - ${location.name}`
    }));

    return baseFormFields.map((field) => {
      switch (field.name) {
        case 'itemId':
          return { ...field, options: itemOptions };
        case 'warehouseId':
          return { 
            ...field, 
            type: 'custom' as const, // Change to custom to enable custom render
            options: warehouseOptions,
            // Add custom render to track warehouse changes
            render: ({ value, onChange, formData, isDisabled }: {
              value: string | number | boolean;
              onChange: (value: string | number | boolean) => void;
              formData: Record<string, string | number | boolean | undefined>;
              isDisabled: boolean;
            }) => {
              console.log("Warehouse render - Value:", value, "FormData warehouseId:", formData.warehouseId, "formWarehouseId state:", formWarehouseId);
              
              const handleWarehouseChange = (val: string) => {
                console.log("Warehouse onValueChange - New value:", val, "Previous formWarehouseId:", formWarehouseId);
                // Only update if the value actually changed
                if (val !== formWarehouseId) {
                  console.log("Value changed, updating formWarehouseId to:", val);
                  onChange(val);
                  // Update the warehouse ID for location fetching
                  setFormWarehouseId(val);
                } else {
                  console.log("Value same as current, not updating");
                }
              };
              
              console.log("Warehouse options:", warehouseOptions);
              
              return (
                <SearchableSelect
                  options={warehouseOptions}
                  value={String(value || '')}
                  onValueChange={handleWarehouseChange}
                  disabled={isDisabled}
                  placeholder="Select a warehouse..."
                />
              );
            }
          };
        case 'uomId':
          return { ...field, options: uomOptions };
        case 'locationId':
          return { 
            ...field, 
            type: 'custom' as const, // Change to custom to enable custom render
            render: ({ value, onChange, isDisabled }: {
              value: string | number | boolean;
              onChange: (value: string | number | boolean) => void;
              isDisabled: boolean;
            }) => {
              console.log("Location render - Value:", value, "formLocations:", formLocations);
              return (
                <SearchableSelect
                  options={locationOptions}
                  value={String(value || '')}
                  onValueChange={(val: string) => onChange(val)}
                  disabled={isDisabled}
                  placeholder={formLocationsLoading ? "Loading locations..." : "Select a location..."}
                />
              );
            }
          };
        default:
          return field;
      }
    }) as typeof baseFormFields;
  }, [items, warehouses, uoms, formLocations, formLocationsLoading, formWarehouseId]);

  // Log the form fields to verify custom render is included
  console.log("Form fields with warehouse render:", 
    formFields.find(f => f.name === 'warehouseId')?.render ? "Custom render found" : "No custom render"
  );

  return (
    <PermissionGuard permission="operations.stock.view">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Stock Movements</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
            <CardDescription>View all stock movement transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <EntityManager
              entityName="Stock Movement"
              entityNamePlural="Stock Movements"
              data={data}
              columns={columns}
              formFields={formFields}
              keyExtractor={(item) => item.id}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              searchPlaceholder="Search by reference..."
              isLoading={isLoading}
              // Disable edit and delete since stock movements are immutable
              showEditButton={false}
              showDeleteButton={false}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
