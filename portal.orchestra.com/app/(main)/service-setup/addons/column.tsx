import { Column } from '@/components/ui/data-table';

type Addon = {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'PHYSICAL' | 'SERVICE';
  basePrice: string | number;
  materialId?: number | null;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  rules?: Array<{
    id: number;
    ruleType: string;
    thresholdValue: number;
    discountPercent: number;
    isActive: boolean;
  }>;
};


const getTypeColor = ({type}: Addon): string => {
  switch (type) {
    case 'PHYSICAL':
      return 'bg-gray-200 text-gray-700';
    case 'SERVICE':
      return 'bg-blue-200 text-blue-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export const columns: Column<Addon>[] = [
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
    header: 'Type',
    accessorKey: 'type',
    cell: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item)}`}>
        {item.type}
      </span>
    ),
  },
  {
    header: 'Base Price',
    accessorKey: 'basePrice',
    cell: (item) => {
      const price = typeof item.basePrice === 'string' ? parseFloat(item.basePrice) : item.basePrice;
      return <span className="font-medium">${price.toFixed(2)}</span>;
    },
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
    header: 'Rules',
    accessorKey: 'rules',
    cell: (item) => {
      const activeRules = item.rules?.filter(r => r.isActive).length || 0;
      const totalRules = item.rules?.length || 0;
      return (
        <span className="text-gray-600">
          {activeRules}/{totalRules}
        </span>
      );
    },
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: () => <></>,
  },
];
