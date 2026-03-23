import { FormField } from '@/components/entity-manager';

export const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Designation Name',
    type: 'text',
    placeholder: 'e.g., Software Engineer',
    required: true,
  },
  {
    name: 'level',
    label: 'Level',
    type: 'number',
    placeholder: 'e.g., 3',
    required: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: "Brief description of the designation's responsibilities...",
    required: false,
  },
];
