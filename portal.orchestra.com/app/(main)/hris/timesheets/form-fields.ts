import { FormField } from '@/components/entity-manager';
import { TimesheetStatus } from '@/store/api/timesheetsApi';

export const formFields: FormField[] = [
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: Object.values(TimesheetStatus).map((status) => ({
      label: status.replace('_', ' '),
      value: status,
    })),
    defaultValue: TimesheetStatus.DRAFT,
    required: true,
  },
  {
    name: 'totalRegularHours',
    label: 'Total Regular Hours',
    type: 'number',
    disabled: true,
  },
  {
    name: 'totalOvertimeHours',
    label: 'Total Overtime Hours',
    type: 'number',
    disabled: true,
  },
];
