import { FormField } from "@/components/entity-manager/types";

export const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Annual Leave',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe the leave type...',
  },
  {
    name: 'isPaid',
    label: 'Paid Leave',
    type: 'select',
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
    defaultValue: 'true',
  },
  {
    name: 'defaultDaysPerYear',
    label: 'Default Days Per Year',
    type: 'number',
    required: true,
    defaultValue: 15,
  },
];
