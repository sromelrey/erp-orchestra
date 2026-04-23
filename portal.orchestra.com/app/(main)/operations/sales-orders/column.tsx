import { Column } from '@/components/ui/data-table';
import { SalesOrder, SalesOrderStatus, SalesOrderItem } from '@/store/api/salesOrdersApi';

const getStatusColor = (status: SalesOrderStatus): string => {
  switch (status) {
    case SalesOrderStatus.DRAFT:
      return 'bg-gray-100 text-gray-700';
    case SalesOrderStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-700';
    case SalesOrderStatus.SHIPPED:
      return 'bg-yellow-100 text-yellow-700';
    case SalesOrderStatus.DELIVERED:
      return 'bg-green-100 text-green-700';
    case SalesOrderStatus.CANCELLED:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const columns: Column<SalesOrder>[] = [
  {
    accessorKey: 'orderNo',
    header: 'Order No',
    cell: (item) => <div className="font-medium">{item.orderNo}</div>,
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: (item) => {
      const date = new Date(item.orderDate);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Delivery Date',
    cell: (item) => {
      if (!item.deliveryDate) return <div>-</div>;
      const date = new Date(item.deliveryDate);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (item) => {
      const status = item.status;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: (item) => {
      const amount = item.totalAmount;

      return <div className="font-medium">${amount}</div>;
    },
  },
  {
    header: 'Services',
    cell: (item) => {
      if (!item.items || item.items.length === 0) return <div>-</div>;

      // Get unique services from all items
      const services = new Set<string>();
      item.items.forEach((orderItem: SalesOrderItem) => {
        if (orderItem.serviceType?.name && orderItem.serviceOption?.name) {
          services.add(`${orderItem.serviceType.name} - ${orderItem.serviceOption.name}`);
        }
      });

      if (services.size === 0) return <div>-</div>;

      const serviceList = Array.from(services).slice(0, 2); // Show max 2 services
      const hasMore = services.size > 2;

      return (
        <div className="text-sm">
          {serviceList.map((service, idx) => (
            <div key={idx}>{service}</div>
          ))}
          {hasMore && <div className="text-gray-500">+{services.size - 2} more</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'discountAmount',
    header: 'Discount',
    cell: (item) => {
      const discount = item.discountAmount;
      return discount ? <div className="text-red-600">-₱{discount}</div> : <div>-</div>;
    },
  },
  {
    accessorKey: 'taxAmount',
    header: 'Tax',
    cell: (item) => {
      const tax = item.taxAmount;
      return tax ? <div className="text-green-600">₱{tax}</div> : <div>-</div>;
    },
  },
  {
    accessorKey: 'finalAmount',
    header: 'Final Amount',
    cell: (item) => {
      const amount = item.finalAmount;
      return <div className="font-semibold">₱{amount}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (item) => {
      const date = new Date(item.createdAt);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
];
