import { FormField } from '@/components/entity-manager';

export const formFields: FormField[] = [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'Enter service type code',
    required: true,
    width: 'half',
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter service type name',
    required: true,
    width: 'half',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
    required: false,
  },
  {
    name: 'isActive',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'true' },
      { label: 'Inactive', value: 'false' },
    ],
    required: false,
    width: 'half',
  },
];
