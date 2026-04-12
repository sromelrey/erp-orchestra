import { Column } from "@/components/ui/data-table";
import { StockAdjustment } from "@/store/api/stockAdjustmentsApi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: Column<StockAdjustment>[] = [
  {
    header: "Adjustment No",
    accessorKey: "adjustmentNumber",
    cell: (item) => (
      <span className="font-medium">{item.adjustmentNumber}</span>
    ),
  },
  {
    header: "Date",
    accessorKey: "adjustmentDate",
    cell: (item) => (
      <span className="font-medium">
        {format(new Date(item.adjustmentDate), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    header: "Type",
    accessorKey: "adjustmentType",
    cell: (item) => {
      const typeConfig = {
        DAMAGE: { label: "Damage", variant: "destructive" as const },
        LOSS: { label: "Loss", variant: "destructive" as const },
        FOUND: { label: "Found", variant: "default" as const },
        COUNT: { label: "Stock Count", variant: "secondary" as const },
      };
      
      const config = typeConfig[item.adjustmentType];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    header: "Warehouse",
    accessorKey: "warehouseId",
    cell: (item) => {
      // This would be populated from the warehouse data
      return <span className="font-medium">Warehouse {item.warehouseId}</span>;
    },
  },
  {
    header: "Items Count",
    cell: (item) => (
      <span className="font-medium">{item.items.length}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item) => {
      const statusConfig = {
        DRAFT: { label: "Draft", variant: "secondary" as const },
        APPROVED: { label: "Approved", variant: "default" as const },
        CANCELLED: { label: "Cancelled", variant: "destructive" as const },
      };
      
      const config = statusConfig[item.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    header: "Reference",
    cell: (item) => (
      <div>
        {item.referenceType && (
          <div className="text-sm">{item.referenceType}</div>
        )}
        {item.referenceId && (
          <div className="text-sm font-medium">#{item.referenceId}</div>
        )}
      </div>
    ),
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: (item) => (
      <span className="text-sm text-gray-600">
        {item.notes || '-'}
      </span>
    ),
  },
];
