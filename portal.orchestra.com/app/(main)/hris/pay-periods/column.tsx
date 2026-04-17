import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PayPeriod } from '@/store/api/payPeriodsApi';

export const columns: Column<PayPeriod>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (item) => <span className="font-bold">{item.name}</span>,
  },
  {
    header: 'Start Date',
    cell: (item) => (
      <span className="font-medium text-gray-600">
        {format(new Date(item.startDate), 'MMMM d, yyyy')}
      </span>
    ),
  },
  {
    header: 'End Date',
    cell: (item) => (
      <span className="font-medium text-gray-600">
        {format(new Date(item.endDate), 'MMMM d, yyyy')}
      </span>
    ),
  },
  {
    header: 'Status',
    cell: (item) => {
      const isClosed = item.status === 'CLOSED';
      const isProcessing = item.status === 'PROCESSING';

      return (
        <Badge
          variant={isClosed ? 'secondary' : isProcessing ? 'default' : 'outline'}
          className={
            isClosed
              ? 'bg-slate-100 text-slate-700'
              : isProcessing
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }
        >
          {item.status}
        </Badge>
      );
    },
  },
];
