import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const columns: Column<any>[] = [
  {
    header: "Role Name",
    accessorKey: "name",
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <Shield className="h-4 w-4 text-purple-600" />
        </div>
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (item) => <span className="text-sm text-gray-600">{item.description || 'No description'}</span>,
  },
  {
    header: "Permissions",
    accessorKey: "permissions",
    cell: (item) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {item.rolePermissions?.length || 0} permissions
      </Badge>
    ),
  },
];
