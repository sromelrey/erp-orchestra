import { Column } from "@/components/ui/data-table";

export const columns: Column<any>[] = [
  {
    header: "Plan Name",
    accessorKey: "name",
    cell: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
  },
  {
    header: "Price / Month",
    accessorKey: "monthlyPrice",
    cell: (item) => (
      <span className="text-sm">
        ${Number(item.monthlyPrice).toFixed(2)}
      </span>
    ),
  },
  {
    header: "Max Users",
    accessorKey: "maxUsers",
    cell: (item) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {item.maxUsers} Users
      </span>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (item) => (
      <span className="text-sm text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];
