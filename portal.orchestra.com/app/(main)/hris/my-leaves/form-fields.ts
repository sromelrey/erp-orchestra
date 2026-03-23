import { FormField } from '@/components/entity-manager/types';

export const getFormFields = (leaveTypes: any[] = []): FormField[] => [
  {
    name: 'leaveTypeId',
    label: 'Leave Type',
    type: 'select',
    required: true,
    valueType: 'number',
    options: leaveTypes.map((t) => ({ label: t.name, value: t.id.toString() })),
    placeholder: 'Select leave type...',
  },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
    width: 'half',
  },
  {
    name: 'endDate',
    label: 'End Date',
    type: 'date',
    required: true,
    width: 'half',
  },
  {
    name: 'reason',
    label: 'Reason / Description',
    type: 'textarea',
    placeholder: 'Briefly explain the reason for your leave request...',
  },
];
