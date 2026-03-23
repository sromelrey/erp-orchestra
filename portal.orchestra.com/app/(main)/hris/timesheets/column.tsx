import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { TimesheetStatus } from '@/store/api/timesheetsApi';

export const columns: Column<any>[] = [
  {
    header: 'Employee',
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-900">
          {item.employee?.lastName}, {item.employee?.firstName}
        </span>
        <span className="text-xs text-gray-500">ID: {item.employeeId}</span>
      </div>
    ),
  },
  {
    header: 'Regular',
    cell: (item) => <span className="font-medium">{item.totalRegularHours}h</span>,
  },
  {
    header: 'Overtime',
    cell: (item) => (
      <span
        className={`font-medium ${item.totalOvertimeHours > 0 ? 'text-amber-600' : 'text-gray-400'}`}
      >
        {item.totalOvertimeHours}h
      </span>
    ),
  },
  {
    header: 'Status',
    cell: (item) => {
      const statusActions: Record<string, { variant: any; className: string }> = {
        [TimesheetStatus.DRAFT]: {
          variant: 'outline',
          className: 'bg-slate-50 text-slate-600',
        },
        [TimesheetStatus.PENDING_REVIEW]: {
          variant: 'default',
          className: 'bg-blue-50 text-blue-700 border-blue-100',
        },
        [TimesheetStatus.APPROVED]: {
          variant: 'default',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        },
        [TimesheetStatus.LOCKED]: {
          variant: 'secondary',
          className: 'bg-gray-100 text-gray-700',
        },
      };

      const config = statusActions[item.status] || statusActions[TimesheetStatus.DRAFT];

      return (
        <Badge variant={config.variant} className={config.className}>
          {item.status.replace('_', ' ')}
        </Badge>
      );
    },
  },
];
