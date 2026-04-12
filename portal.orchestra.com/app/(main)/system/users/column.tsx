import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';

export const columns: Column<User>[] = [
  {
    header: 'Name',
    cell: (item) => (
      <span className="font-medium">
        {`${item.firstName || ''} ${item.lastName || ''}`.trim() || item.email}
      </span>
    ),
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: (item) => <span className="text-sm text-gray-600">{item.email}</span>,
  },
  {
    header: 'Roles',
    cell: (item) => (
      <div className="flex flex-wrap gap-1">
        {item.userRoles && item.userRoles.length > 0 ? (
          item.userRoles.map((ur) => (
            <Badge key={ur.role?.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {ur.role?.name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-gray-500">No roles</span>
        )}
      </div>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (item) => {
      const statusConfig = {
        ACTIVE: { label: 'Active', className: 'bg-green-50 text-green-700 border-green-200' },
        INACTIVE: { label: 'Inactive', className: 'bg-gray-50 text-gray-700 border-gray-200' },
        BANNED: { label: 'Banned', className: 'bg-red-50 text-red-700 border-red-200' },
      };
      const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.INACTIVE;
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
];
