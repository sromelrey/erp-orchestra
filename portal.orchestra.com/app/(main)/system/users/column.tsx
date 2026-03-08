import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

export const columns: Column<any>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: (item) => <span className="font-medium">{item.name}</span>,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: (item) => <span className="text-sm text-gray-600">{item.email}</span>,
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: (item) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {item.userRoles?.[0]?.role?.name || 'No Role'}
      </Badge>
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
