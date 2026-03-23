import { FormField } from '@/components/entity-manager';

export const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Branch Name',
    type: 'text',
    placeholder: 'e.g., Main Office',
    required: true,
  },
  {
    name: 'address',
    label: 'Physical Address',
    type: 'textarea',
    placeholder: 'e.g., 123 Main Street...',
    required: false,
  },
  {
    name: 'contactNumber',
    label: 'Contact Number',
    type: 'text',
    placeholder: 'e.g., +63 2 8888 1234',
    required: false,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
    ],
    defaultValue: 'Active',
  },
];
