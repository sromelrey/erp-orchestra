import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight } from "lucide-react";
import { Warehouse } from "@/types/operations";
import Link from "next/link";

export const columns: Column<Warehouse>[] = [
  {
    header: "Warehouse",
    accessorKey: "name",
    cell: (warehouse) => (
      <Link 
        href={`/operations/warehouses/${warehouse.id}`}
        className="flex items-center gap-3 hover:bg-accent/50 p-2 rounded-md transition-colors group"
      >
        <div className="p-2 rounded-lg bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium group-hover:text-primary transition-colors">
            {warehouse.name}
          </p>
          <p className="text-sm text-muted-foreground">{warehouse.code}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (warehouse) => (
      <span className="text-sm">{warehouse.description || "No description"}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (warehouse) => (
      <Badge variant={warehouse.isActive ? "default" : "secondary"}>
        {warehouse.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    header: "Default",
    accessorKey: "isDefault",
    cell: (warehouse) => (
      <Badge variant={warehouse.isDefault ? "default" : "outline"}>
        {warehouse.isDefault ? "Yes" : "No"}
      </Badge>
    ),
  },
];
