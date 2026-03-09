import { Column } from "@/components/ui/data-table";

export const columns: Column<any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Description', accessorKey: 'description' },
  { 
    header: 'Paid', 
    cell: (item: any) => (item.isPaid ? 'Yes' : 'No') 
  },
  { header: 'Default Days', accessorKey: 'defaultDaysPerYear' },
];
