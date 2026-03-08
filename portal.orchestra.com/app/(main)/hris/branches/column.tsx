import { Column } from "@/components/ui/data-table";

export const columns: Column<any>[] = [
  {
    header: "Branch",
    accessorKey: "name",
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
          {item.name ? item.name.charAt(0).toUpperCase() : "-"}
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          {item.code && <p className="text-xs text-muted-foreground">{item.code}</p>}
        </div>
      </div>
    ),
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: (item) => (
      <span className="text-sm text-gray-500">
        {item.address || "-"}
      </span>
    ),
  },
  {
    header: "Contact Number",
    accessorKey: "contactNumber",
    cell: (item) => (
      <span className="text-sm text-gray-500">
        {item.contactNumber || item.contact_number || "-"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item) => (
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          item.status === 'Active' || item.status === 'active'
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : "bg-red-50 text-red-700 ring-red-600/10"
        }`}
      >
        {item.status || "Inactive"}
      </span>
    ),
  },
];
