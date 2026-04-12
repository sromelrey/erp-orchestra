import { Column } from "@/components/ui/data-table";
import { StockTransfer } from "@/store/api/stockTransfersApi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: Column<StockTransfer>[] = [
  {
    header: "Transfer No",
    accessorKey: "transferNumber",
    cell: (item) => (
      <span className="font-medium">{item.transferNumber}</span>
    ),
  },
  {
    header: "Transfer Date",
    accessorKey: "transferDate",
    cell: (item) => (
      <span className="font-medium">
        {format(new Date(item.transferDate), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    header: "From Warehouse",
    accessorKey: "sourceWarehouseId",
    cell: (item) => (
      <div>
        <span className="font-medium">WH {item.sourceWarehouseId}</span>
        {item.sourceLocationId && (
          <div className="text-sm text-gray-500">Loc {item.sourceLocationId}</div>
        )}
      </div>
    ),
  },
  {
    header: "To Warehouse",
    accessorKey: "destinationWarehouseId",
    cell: (item) => (
      <div>
        <span className="font-medium">WH {item.destinationWarehouseId}</span>
        {item.destinationLocationId && (
          <div className="text-sm text-gray-500">Loc {item.destinationLocationId}</div>
        )}
      </div>
    ),
  },
  {
    header: "Expected Date",
    accessorKey: "expectedDate",
    cell: (item) => (
      <span className="text-sm">
        {item.expectedDate ? format(new Date(item.expectedDate), "MMM dd, yyyy") : '-'}
      </span>
    ),
  },
  {
    header: "Items Count",
    cell: (item) => (
      <span className="font-medium">{item.items?.length || 0}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item) => {
      const statusConfig = {
        PENDING: { label: "Pending", variant: "secondary" as const },
        APPROVED: { label: "Approved", variant: "default" as const },
        IN_TRANSIT: { label: "In Transit", variant: "outline" as const },
        RECEIVED: { label: "Received", variant: "default" as const },
        CANCELLED: { label: "Cancelled", variant: "destructive" as const },
      };
      
      const config = statusConfig[item.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
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
