import { FormField } from '@/components/entity-manager';

export const formFields: FormField[] = [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'Enter service option code',
    required: true,
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter service option name',
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
