import { Column } from "@/components/ui/data-table";

export const columns: Column<any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Description', accessorKey: 'description' },
  { 
    header: 'Paid', 
    cell: (item: any) => (item.isPaid ? 'Yes' : 'No') 
  },
  { header: 'Default Days', accessorKey: 'defaultDaysPerYear' },
  { header: 'Advance Notice', accessorKey: 'minDaysAdvance' },
  { 
    header: 'Allow Past', 
    cell: (item: any) => (item.allowPastDates ? 'Yes' : 'No') 
  },
  { 
    header: 'Allow Today', 
    cell: (item: any) => (item.allowSameDay ? 'Yes' : 'No') 
  },
];
