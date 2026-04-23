import { Column } from '@/components/ui/data-table';

type ServiceConfiguration = {
  id: number;
  serviceTypeId: number;
  serviceOptionId: number;
  conditionKey?: string;
  conditionValue?: string;
  bomId?: number;
  price: number;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  serviceType?: { name: string };
  serviceOption?: { name: string };
};

export const columns: Column<ServiceConfiguration>[] = [
  {
    header: 'Service Type',
    accessorKey: 'serviceType',
    cell: (item) => <span className="font-medium">{item.serviceType?.name || '-'}</span>,
  },
  {
    header: 'Service Option',
    accessorKey: 'serviceOption',
    cell: (item) => <span>{item.serviceOption?.name || '-'}</span>,
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: (item) => <span className="font-medium">${item.price}</span>,
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
];
