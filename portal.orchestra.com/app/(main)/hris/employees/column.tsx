import { Column } from "@/components/ui/data-table";
import { Employee } from "@/types";

export const columns: Column<Employee>[] = [
  {
    header: "Employee",
    accessorKey: "firstName",
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
          {item.firstName ? item.firstName.charAt(0).toUpperCase() : "-"}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {item.firstName} {item.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{item.email || "No email"}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Designation",
    accessorKey: "designation",
    cell: (item) => (
      <span className="text-sm text-gray-600">
        {item.designation ? item.designation.name : "-"}
      </span>
    ),
  },
  {
    header: "Department",
    accessorKey: "department",
    cell: (item) => (
      <span className="text-sm text-gray-600">
        {item.department ? item.department.name : "-"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        item.status === 'ACTIVE' 
          ? 'bg-green-50 text-green-700 ring-green-600/20' 
          : 'bg-red-50 text-red-700 ring-red-600/10'
      }`}>
        {item.status || 'ACTIVE'}
      </span>
    ),
  },
];
