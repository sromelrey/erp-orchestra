import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const columns: Column<any>[] = [
  {
    header: 'Employee',
    cell: (item) => (
      <div>
        <div className="font-medium text-gray-900">
          {item.employee?.firstName} {item.employee?.lastName}
        </div>
        <div className="text-xs text-muted-foreground">{item.employee?.employeeCode}</div>
      </div>
    ),
  },
  {
    header: 'Type',
    cell: (item) => <Badge variant="outline">{item.leaveType?.name}</Badge>,
  },
  {
    header: 'Period',
    cell: (item) => (
      <div className="text-sm">
        {format(new Date(item.startDate), 'MMM d')} -{' '}
        {format(new Date(item.endDate), 'MMM d, yyyy')}
      </div>
    ),
  },
  {
    header: 'Reason',
    accessorKey: 'reason',
    className: 'max-w-[200px] truncate',
  },
  {
    header: 'Status',
    cell: (item) => {
      const variants: any = {
        PENDING: 'secondary',
        APPROVED: 'default',
        REJECTED: 'destructive',
        CANCELLED: 'outline',
      };
      return <Badge variant={variants[item.status]}>{item.status}</Badge>;
    },
  },
];
