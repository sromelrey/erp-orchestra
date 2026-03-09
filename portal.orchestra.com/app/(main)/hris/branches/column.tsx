import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/types";

export const columns: Column<Branch>[] = [
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
    header: "Phone",
    accessorKey: "phone",
    cell: (item) => (
      <span className="text-sm text-gray-500">
        {item.phone || "-"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (item) => (
      <Badge 
        variant="outline" 
        className={item.isActive 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-gray-50 text-gray-700 border-gray-200"
        }
      >
        {item.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
