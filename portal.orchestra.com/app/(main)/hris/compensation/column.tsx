import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  EmployeeCompensation,
  PaymentFrequency,
} from "@/store/api/compensationApi";

export const columns: Column<EmployeeCompensation>[] = [
  {
    header: "Employee",
    accessorKey: "employeeId",
    cell: (item) => (
      <span className="font-medium">Employee ID: {item.employeeId}</span>
    ),
  },
  {
    header: "Base Salary",
    accessorKey: "baseSalary",
    cell: (item) => (
      <span className="font-medium">
        {item.baseSalary ? `₱${item.baseSalary.toLocaleString()}` : "N/A"}
      </span>
    ),
  },
  {
    header: "Hourly Rate",
    accessorKey: "hourlyRate",
    cell: (item) => (
      <span className="font-medium">
        {item.hourlyRate ? `₱${item.hourlyRate.toLocaleString()}` : "N/A"}
      </span>
    ),
  },
  {
    header: "Overtime Rate",
    accessorKey: "overtimeRate",
    cell: (item) => (
      <span className="font-medium">
        {item.overtimeRate ? `${item.overtimeRate}x` : "N/A"}
      </span>
    ),
  },
  {
    header: "Currency",
    accessorKey: "currency",
    cell: (item) => <span className="font-medium">{item.currency}</span>,
  },
  {
    header: "Payment Frequency",
    accessorKey: "paymentFrequency",
    cell: (item) => {
      const frequencyConfig = {
        [PaymentFrequency.WEEKLY]: {
          label: "Weekly",
          variant: "default" as const,
        },
        [PaymentFrequency.BI_WEEKLY]: {
          label: "Bi-Weekly",
          variant: "secondary" as const,
        },
        [PaymentFrequency.SEMI_MONTHLY]: {
          label: "Semi-Monthly",
          variant: "outline" as const,
        },
        [PaymentFrequency.MONTHLY]: {
          label: "Monthly",
          variant: "default" as const,
        },
      };

      const config = frequencyConfig[item.paymentFrequency];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    header: "Effective Date",
    accessorKey: "effectiveDate",
    cell: (item) => (
      <span className="text-sm">
        {format(new Date(item.effectiveDate), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    cell: (item) => (
      <span className="text-sm">
        {item.endDate
          ? format(new Date(item.endDate), "MMM dd, yyyy")
          : "Ongoing"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (item) => (
      <Badge variant={item.isActive ? "default" : "secondary"}>
        {item.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    header: "Actions",
    className: "text-right",
    cell: () => (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
