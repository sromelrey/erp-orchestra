import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { JobExecutionLog } from '@/store/api/timesheetsApi';

export const columns: Column<JobExecutionLog>[] = [
  {
    header: 'Job Name',
    accessorKey: 'jobName',
    cell: (item) => <span className="font-medium">{item.jobName}</span>,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (item) => {
      const statusConfig = {
        SUCCESS: { variant: 'default' as const, label: 'Success' },
        FAILED: { variant: 'destructive' as const, label: 'Failed' },
        PARTIAL: { variant: 'secondary' as const, label: 'Partial' },
      };

      const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.PARTIAL;

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    header: 'Processed',
    accessorKey: 'processedCount',
    cell: (item) => <span className="text-green-600 font-medium">{item.processedCount}</span>,
  },
  {
    header: 'Errors',
    accessorKey: 'errorCount',
    cell: (item) => (
      <span className={`font-medium ${item.errorCount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
        {item.errorCount}
      </span>
    ),
  },
  {
    header: 'Started At',
    accessorKey: 'startedAt',
    cell: (item) => (
      <span className="text-sm">{format(new Date(item.startedAt), 'MMM dd, yyyy HH:mm')}</span>
    ),
  },
  {
    header: 'Duration',
    accessorKey: 'completedAt',
    cell: (item) => {
      const duration = item.completedAt
        ? new Date(item.completedAt).getTime() - new Date(item.startedAt).getTime()
        : null;

      if (!duration) return <span className="text-gray-500">-</span>;

      const seconds = Math.floor(duration / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0)
        return (
          <span>
            {hours}h {minutes % 60}m
          </span>
        );
      if (minutes > 0)
        return (
          <span>
            {minutes}m {seconds % 60}s
          </span>
        );
      return <span>{seconds}s</span>;
    },
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: () => (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
