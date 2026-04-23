import { Column } from '@/components/ui/data-table';

type ServiceOption = {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
};

export const columns: Column<ServiceOption>[] = [
  {
    header: 'Code',
    accessorKey: 'code',
    cell: (item) => <span className="font-medium">{item.code}</span>,
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (item) => <span>{item.name}</span>,
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: (item) => <span className="text-gray-600">{item.description || '-'}</span>,
  },
  {
    header: 'Active',
    accessorKey: 'isActive',
    cell: (item) => (
      <span className={item.isActive ? 'text-green-600' : 'text-red-600'}>
        {item.isActive ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: () => <></>,
  },
];
