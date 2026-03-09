import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

export const columns: Column<User>[] = [
  {
    header: "Name",
    cell: (item) => <span className="font-medium">{`${item.firstName || ''} ${item.lastName || ''}`.trim() || item.email}</span>,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: (item) => <span className="text-sm text-gray-600">{item.email}</span>,
  },
  {
    header: "Role",
    cell: (item) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {item.userRoles?.[0]?.role?.name || 'No Role'}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item) => (
      <Badge 
        variant="outline" 
        className={item.status === 'ACTIVE' 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-gray-50 text-gray-700 border-gray-200"
        }
      >
        {item.status}
      </Badge>
    ),
  },
];
