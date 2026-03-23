import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { LogIn, LogOut, MapPin } from 'lucide-react';

export const columns: Column<any>[] = [
  {
    header: 'Event Type',
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div
          className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${row.type === 'CLOCK_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
        >
          {row.type === 'CLOCK_IN' ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
        </div>
        <span className="font-semibold text-sm">
          {row.type === 'CLOCK_IN' ? 'Clock In' : 'Clock Out'}
        </span>
      </div>
    ),
  },
  {
    header: 'Date',
    cell: (row) => (
      <span className="text-sm font-medium text-gray-600">
        {format(new Date(row.timestamp), 'MMM d, yyyy')}
      </span>
    ),
  },
  {
    header: 'Time',
    cell: (row) => (
      <span className="text-sm font-bold text-gray-900">
        {format(new Date(row.timestamp), 'h:mm a')}
      </span>
    ),
  },
  {
    header: 'Location',
    cell: (row) =>
      row.location ? (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 font-medium"
        >
          <MapPin className="h-3 w-3" />
          Recorded
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground italic">No GPS data</span>
      ),
  },
  {
    header: 'Device',
    className: 'text-xs text-muted-foreground hidden lg:table-cell',
    cell: (row) => (
      <div className="truncate max-w-[300px]" title={row.deviceInfo || 'Unknown Device'}>
        {row.deviceInfo || 'Unknown Device'}
      </div>
    ),
  },
];
