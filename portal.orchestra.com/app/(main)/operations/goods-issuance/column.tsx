import { Column } from "@/components/ui/data-table";
import { GoodsIssuance } from "@/store/api/goodsIssuanceApi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const truncate = (str: string | null | undefined, maxLength: number = 50) => {
  if (!str) return '-';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const columns: Column<GoodsIssuance>[] = [
  {
    header: "Issuance No",
    accessorKey: "issuanceNumber",
    cell: (item) => (
      <span className="font-medium">{item.issuanceNumber}</span>
    ),
  },
  {
    header: "Date",
    accessorKey: "issuanceDate",
    cell: (item) => (
      <span className="font-medium">
        {format(new Date(item.issuanceDate), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    header: "Type",
    accessorKey: "issuanceType",
    cell: (item) => {
      const typeConfig = {
        PRODUCTION: { label: "Production", variant: "default" as const },
        SALES: { label: "Sales", variant: "secondary" as const },
        TRANSFER: { label: "Transfer", variant: "outline" as const },
        ADJUSTMENT: { label: "Adjustment", variant: "destructive" as const },
      };
      
      const config = typeConfig[item.issuanceType];
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
    header: "Department",
    accessorKey: "issuedToDepartmentId",
    cell: (item) => (
      <span className="text-sm">
        {item.issuedToDepartmentId ? `Dept ${item.issuedToDepartmentId}` : '-'}
      </span>
    ),
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
        ISSUED: { label: "Issued", variant: "default" as const },
      };
      
      const config = statusConfig[item.status];
      return config ? <Badge variant={config.variant}>{config.label}</Badge> : <Badge variant="outline">{item.status}</Badge>;
    },
  },
  {
    header: "Reference",
    cell: (item) => (
      <div>
        {item.referenceType && (
          <div className="text-sm">{item.referenceType}</div>
        )}
        {item.referenceCode && (
          <div className="text-sm font-medium">{item.referenceCode}</div>
        )}
      </div>
    ),
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: (item) => (
      <span className="text-sm text-gray-600" title={item.notes || ''}>
        {truncate(item.notes, 20)}
      </span>
    ),
  },
];
