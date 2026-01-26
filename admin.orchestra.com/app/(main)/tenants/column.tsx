import { 
    Column 
} from "@/components/ui/data-table";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  suspended: {
    label: "Suspended",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

// Define columns for the DataTable
export const columns: Column<any>[] = [
  {
    header: "Tenant",
    cell: (tenant) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
          {tenant.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{tenant.name}</p>
          <p className="text-xs text-muted-foreground">
            {tenant.subdomain}.orchestra.com
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Plan",
    cell: (tenant) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {tenant.plan?.name || tenant.plan || "Free"}
      </span>
    ),
  },
  {
    header: "Status",
    cell: (tenant) => {
      const status =
        statusConfig[tenant.status as keyof typeof statusConfig] ||
        statusConfig.pending;
      const StatusIcon = status.icon;
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      );
    },
  },
  {
    header: "Users",
    cell: (tenant) => (
      <span className="text-sm text-gray-700">
        {tenant.userCount || tenant.users || 0}
      </span>
    ),
  },
  {
    header: "Created",
    cell: (tenant) => (
      <span className="text-sm text-gray-500">
        {new Date(tenant.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  
];