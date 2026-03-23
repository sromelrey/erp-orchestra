import { FormField } from '@/components/entity-manager/types';

export const formFields: FormField[] = [
  {
    name: 'comments',
    label: 'Approver Comments',
    type: 'textarea',
    placeholder: 'Add comments for the employee regarding this decision...',
    description: 'Provide a reason for approval or rejection.',
  },
];
