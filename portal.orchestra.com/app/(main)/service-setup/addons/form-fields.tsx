import { FormField } from '@/components/entity-manager';

export const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter add-on name',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
    required: false,
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { label: 'Physical', value: 'PHYSICAL' },
      { label: 'Service', value: 'SERVICE' },
    ],
    defaultValue: 'PHYSICAL',
    required: true,
  },
  {
    name: 'basePrice',
    label: 'Base Price',
    type: 'number',
    placeholder: 'Enter base price',
    required: true,
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'select',
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
    defaultValue: 'true',
    required: false,
  },
  {
    name: 'rules',
    label: 'Inclusion Rules',
    type: 'nested-array',
    nestedArrayConfig: {
      itemLabel: 'Rule',
      itemsLabel: 'Rules',
      emptyMessage: 'No inclusion rules added yet',
      columns: [
        {
          key: 'ruleType',
          label: 'Rule Type',
          type: 'select',
          options: [
            { label: 'Quantity Threshold', value: 'QUANTITY_THRESHOLD' },
            { label: 'Order Total', value: 'ORDER_TOTAL' },
          ],
          required: true,
        },
        {
          key: 'thresholdValue',
          label: 'Threshold Value',
          type: 'number',
          required: true,
          allowNegative: false,
          allowDecimal: false,
        },
        {
          key: 'discountPercent',
          label: 'Discount %',
          type: 'number',
          required: true,
          allowNegative: false,
          allowDecimal: true,
          decimalScale: 2,
        },
        {
          key: 'isActive',
          label: 'Active',
          type: 'select',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ],
          required: false,
        },
      ],
    },
    required: false,
  },
  ];
