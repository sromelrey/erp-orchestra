import { Column } from "@/components/ui/data-table";

export const columns: Column<any>[] = [
  {
    header: "Department Name",
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
    header: "Description",
    accessorKey: "description",
    cell: (item) => (
      <span className="text-sm text-gray-500">
        {item.description || "-"}
      </span>
    ),
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: (item) => (
      <span className="text-sm text-gray-500">
        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
      </span>
    ),
  },
];
