import { FormField, FormFieldOption } from '@/components/entity-manager/types';
import { SalesOrderStatus } from '@/store/api/salesOrdersApi';

function isOrderEditable(status: SalesOrderStatus): boolean {
  return status === SalesOrderStatus.DRAFT;
}

export const getFormFields = (
  itemOptions: Array<{ value: string; label: string }>,
  uomOptions: Array<{ value: string; label: string }>,
  warehouseOptions: Array<{ value: string; label: string }>,
  locationOptions: Array<{ value: string; label: string }>,
  getLocationsByWarehouse?: (warehouseId: string | number) => Promise<FormFieldOption[]>,
  currentStatus?: SalesOrderStatus
): FormField[] => {
  const isEditable = !currentStatus || isOrderEditable(currentStatus);

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
      columns: [
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
          key: 'unitPrice',
          label: 'Unit Price',
          type: 'number',
          required: true,
        
        },
        {
          key: 'unitOfMeasureId',
          label: 'Unit of Measure',
          type: 'select',
          options: uomOptions,
          required: true,
       
        },
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
  },
  ];
}

// Legacy export for backward compatibility
export const baseFormFields = getFormFields([], [], [], []);
