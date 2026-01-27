import { Column } from "@/components/ui/data-table";

export const columns: Column<any>[] = [
  {
    header: "Module Name",
    accessorKey: "name",
    cell: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
  },
  {
    header: "Code",
    accessorKey: "code",
    cell: (item) => (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        {item.code}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (item) => (
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          item.isActive
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : "bg-red-50 text-red-700 ring-red-600/10"
        }`}
      >
        {item.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
];
