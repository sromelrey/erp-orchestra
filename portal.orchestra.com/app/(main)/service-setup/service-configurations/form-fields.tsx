import { FormField } from '@/components/entity-manager';

export const formFields: FormField[] = [
  {
    name: 'serviceTypeId',
    label: 'Service Type',
    type: 'select',
    placeholder: 'Select service type',
    required: true,
    options: [], // Will be populated dynamically
  },
  {
    name: 'serviceOptionId',
    label: 'Service Option',
    type: 'select',
    placeholder: 'Select service option',
    required: true,
    options: [], // Will be populated dynamically
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'Enter price',
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
];
