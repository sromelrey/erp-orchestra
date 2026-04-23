import { FormField, FormFieldOption } from '@/components/entity-manager/types';
import { SalesOrderStatus } from '@/store/api/salesOrdersApi';
import { Badge } from '@/components/ui/badge';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';

function isOrderEditable(status: SalesOrderStatus): boolean {
  return status === SalesOrderStatus.DRAFT;
}

export const getFormFields = (
  itemOptions: Array<{ value: string; label: string }>,
  uomOptions: Array<{ value: string; label: string }>,
  warehouseOptions: Array<{ value: string; label: string }>,
  locationOptions: Array<{ value: string; label: string }>,
  getLocationsByWarehouse?: (warehouseId: string | number) => Promise<FormFieldOption[]>,
  currentStatus?: SalesOrderStatus,
  serviceTypeOptions?: Array<{ value: string; label: string }>,
  serviceOptionOptions?: Array<{ value: string; label: string }>,
  addonOptions?: Array<{ value: string; label: string }>
): FormField[] => {
  const isEditable = currentStatus === undefined || isOrderEditable(currentStatus);

  // Custom render for addons with multiple selection
  const renderAddons = ({ value, onChange, isDisabled }: { value: unknown; onChange: (value: string | number | unknown) => void; item: Record<string, string | number | unknown>; itemIndex: number; column: unknown; isDisabled: boolean }) => {
    const selectedAddons = Array.isArray(value) ? value as Array<{ addonId: number; quantity: number }> : [];

    // Table view: show only 4 addons with more indicator
    if (isDisabled) {
      const displayAddons = selectedAddons.slice(0, 4);
      const remainingCount = selectedAddons.length - 4;

      return (
        <div className="flex flex-wrap gap-1">
          {displayAddons.map((addon) => {
            const option = addonOptions?.find(opt => opt.value === String(addon.addonId));
            return (
              <Badge key={addon.addonId} variant="secondary" className="text-xs">
                {option?.label || `Add-on ${addon.addonId}`}
              </Badge>
            );
          })}
          {remainingCount > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingCount} more
            </Badge>
          )}
        </div>
      );
    }

    // Form view: show full multi-select combobox
    return (
      <MultiSelectCombobox
        value={selectedAddons}
        onChange={(newValue) => onChange(newValue)}
        options={addonOptions || []}
        disabled={isDisabled}
        idKey="addonId"
        placeholder="Select add-on"
      />
    );
  };

  return [
  {
    name: 'customerName',
    label: 'Customer Name',
    type: 'text',
    width:'full',
    required: true,
    placeholder: 'Enter customer name',
    disabled: !isEditable,
  },
  {
    name: 'orderDate',
    label: 'Order Date',
    type: 'date',
    width:'half',
    required: true,
    defaultValue: new Date().toISOString().split('T')[0],
    disabled: !isEditable,
  },
  {
    name: 'deliveryDate',
    label: 'Delivery Date',
    type: 'date',
    width:'half',
    required: false,
    disabled: !isEditable,
  },
  {
    name: 'discountAmount',
    label: 'Discount Amount',
    type: 'number',
    width:'half',
    required: false,
    placeholder: 'Enter discount amount...',
    disabled: !isEditable,
  },
  {
    name: 'taxAmount',
    label: 'Tax Amount',
    type: 'number',
    width:'half',
    required: false,
    placeholder: 'Enter tax amount...',
    disabled: !isEditable,
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    required: false,
    placeholder: 'Enter any additional notes...',
    disabled: !isEditable,
  },
 
  {
    name: 'items',
    label: 'Order Items',
    type: 'nested-array',
    required: true,
    disabled: !isEditable,
    nestedArrayConfig: {
      itemLabel: 'Item',
      itemsLabel: 'Items',
      emptyMessage: 'No items added yet. Click "Add Item" to start.',
      useTabs: true,
      topRowColumns: [
        {
          key: 'itemId',
          label: 'Item',
          type: 'select',
          options: itemOptions,
          required: true,
        },
        {
          key: 'quantity',
          label: 'Quantity',
          type: 'number',
          required: true,
        },
        {
          key: 'unitOfMeasureId',
          label: 'UOM',
          type: 'select',
          options: uomOptions,
          required: true,
        },
        {
          key: 'unitPrice',
          label: 'Unit Price',
          type: 'number',
          required: true,
        },
      ],
      tabs: [
        {
          value: 'pricing',
          label: 'Pricing',
          columns: [
            {
              key: 'discountPercent',
              label: 'Discount %',
              type: 'number',
              required: false,
            },
            {
              key: 'taxPercent',
              label: 'Tax %',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          value: 'fulfillment',
          label: 'Fulfillment',
          columns: [
            {
              key: 'warehouseId',
              label: 'Warehouse',
              type: 'select',
              options: warehouseOptions,
              required: true,
            },
            {
              key: 'locationId',
              label: 'Location',
              type: 'select',
              options: locationOptions,
              required: true,
              dependsOn: 'warehouseId',
              getOptions: getLocationsByWarehouse ? async (warehouseId: string | number) => {
                return getLocationsByWarehouse(warehouseId);
              } : undefined,
            },
          ],
        },
        {
          value: 'printing',
          label: 'Printing',
          gridCols: 3,
          columns: [
            {
              key: 'serviceTypeId',
              label: 'Service',
              type: 'select',
              options: serviceTypeOptions || [],
              required: false, 
            },
            {
              key: 'serviceOptionId',
              label: 'Service Option',
              type: 'select',
              options: serviceOptionOptions || [],
              required: false, 
            },
            {
              key: 'labelSource',
              label: 'Label Source',
              type: 'select',
              options: [
                { label: 'Customer', value: 'CUSTOMER' },
                { label: 'Company', value: 'COMPANY' }
              ],
              required: false, 
            },
            {
              key: 'addons',
              label: 'Add-ons',
              type: 'custom',
              required: false,
              render: renderAddons,
              width: 'full',
            },
          ],
        },
      ],
    },
  },
  ];
}

// Legacy export for backward compatibility
export const baseFormFields = getFormFields([], [], [], []);
