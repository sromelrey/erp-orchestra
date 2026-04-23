import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

export interface ServiceType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export const columns: Column<ServiceType>[] = [
  {
    header: '',
    className: 'w-10',
    cell: () => <ChevronRight className="w-4 h-4 text-gray-400" />,
  },
  {
    header: 'Code',
    accessorKey: 'code',
    cell: (item) => <span className="font-mono text-sm">{item.code}</span>,
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (item) => <span className="font-medium">{item.name}</span>,
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: (item) => <span className="text-gray-600">{item.description || '-'}</span>,
  },
  {
    header: 'Status',
    accessorKey: 'isActive',
    cell: (item) => (
      <Badge variant={item.isActive ? 'default' : 'secondary'}>
        {item.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    header: 'Created',
    accessorKey: 'createdAt',
    cell: (item) => (
      <span className="text-gray-600">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: () => <></>,
  },
];
