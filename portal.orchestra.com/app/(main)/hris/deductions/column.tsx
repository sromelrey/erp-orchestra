import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  EmployeeDeduction,
  DeductionType,
  DeductionFrequency,
} from "@/store/api/compensationApi";

export const columns: Column<EmployeeDeduction>[] = [
  {
    header: "Employee",
    accessorKey: "employeeId",
    cell: (item) => (
      <span className="font-medium">Employee ID: {item.employeeId}</span>
    ),
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: (item) => <span className="font-medium">{item.name}</span>,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: (item) => {
      const typeConfig = {
        [DeductionType.FIXED]: { label: "Fixed", variant: "default" as const },
        [DeductionType.PERCENTAGE]: {
          label: "Percentage",
          variant: "secondary" as const,
        },
        [DeductionType.RECURRING]: {
          label: "Recurring",
          variant: "outline" as const,
        },
        [DeductionType.VARIABLE]: {
          label: "Variable",
          variant: "destructive" as const,
        },
      };

      const config = typeConfig[item.type];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (item) => (
      <span className="font-medium">
        {item.amount ? `₱${item.amount.toLocaleString()}` : "N/A"}
      </span>
    ),
  },
  {
    header: "Percentage",
    accessorKey: "percentage",
    cell: (item) => (
      <span className="font-medium">
        {item.percentage ? `${item.percentage}%` : "N/A"}
      </span>
    ),
  },
  {
    header: "Frequency",
    accessorKey: "frequency",
    cell: (item) => {
      const frequencyConfig = {
        [DeductionFrequency.ONE_TIME]: {
          label: "One-Time",
          variant: "default" as const,
        },
        [DeductionFrequency.MONTHLY]: {
          label: "Monthly",
          variant: "secondary" as const,
        },
        [DeductionFrequency.QUARTERLY]: {
          label: "Quarterly",
          variant: "outline" as const,
        },
        [DeductionFrequency.ANNUALLY]: {
          label: "Annually",
          variant: "default" as const,
        },
      };

      const config = frequencyConfig[item.frequency];

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
