import { Column } from '@/components/ui/data-table';
import { LeaveType } from '@/store/api/leaveApi';

export const columns: Column<LeaveType>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Description', accessorKey: 'description' },
  {
    header: 'Paid',
    cell: (item: LeaveType) => (item.isPaid ? 'Yes' : 'No'),
  },
  { header: 'Default Days', accessorKey: 'defaultDaysPerYear' },
];
