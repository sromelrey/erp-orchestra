import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format, differenceInBusinessDays } from 'date-fns';

export const columns: Column<any>[] = [
  {
    header: 'Leave Type',
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{item.leaveType?.name}</span>
        <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">
          {item.reason || 'No reason provided'}
        </span>
      </div>
    ),
  },
  {
    header: 'Dates',
    cell: (item: any) => (
      <div className="flex flex-col text-sm">
        <span className="font-medium text-gray-700">
          {format(new Date(item.startDate), 'MMM d')} -{' '}
          {format(new Date(item.endDate), 'MMM d, yyyy')}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Applied {format(new Date(item.createdAt), 'MMM d')}
        </span>
      </div>
    ),
  },
  {
    header: 'Duration',
    cell: (item: any) => {
      const days = differenceInBusinessDays(new Date(item.endDate), new Date(item.startDate)) + 1;
      return (
        <span className="font-mono font-bold text-gray-600">
          {days} {days === 1 ? 'Day' : 'Days'}
        </span>
      );
    },
  },
  {
    header: 'Status',
    cell: (item: any) => {
      const status = item.status || 'PENDING';
      const variants: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
        APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
      };

      return (
        <Badge variant="outline" className={variants[status] || ''}>
          {status}
        </Badge>
      );
    },
  },
];
