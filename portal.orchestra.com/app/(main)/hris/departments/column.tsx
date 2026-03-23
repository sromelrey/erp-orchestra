import { Column } from '@/components/ui/data-table';
import { Department } from '@/types';

export const columns: Column<Department>[] = [
  {
    header: 'Department Name',
    accessorKey: 'name',
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
          {item.name ? item.name.charAt(0).toUpperCase() : '-'}
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          {item.code && <p className="text-xs text-muted-foreground">{item.code}</p>}
        </div>
      </div>
    ),
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: (item) => <span className="text-sm text-gray-500">{item.description || '-'}</span>,
  },
  {
    header: 'Status',
    accessorKey: 'isActive',
    cell: (item) => (
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          item.isActive
            ? 'bg-green-50 text-green-700 ring-green-600/20'
            : 'bg-gray-50 text-gray-700 ring-gray-600/10'
        }`}
      >
        {item.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];
