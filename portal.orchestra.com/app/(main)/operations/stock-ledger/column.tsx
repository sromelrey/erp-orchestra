import { Column } from "@/components/ui/data-table";
import { MovementTypeBadge } from "@/components/operations/stock-ledger/MovementTypeBadge";
import { StockLedgerEntry, StockMovementType } from "@/types";
import { format } from "date-fns";

export const columns: Column<StockLedgerEntry>[] = [
  {
    header: "Date",
    accessorKey: "documentDate",
    cell: (entry) => (
      <span className="font-medium">
        {entry.documentDate ? format(new Date(entry.documentDate), "MMM dd, yyyy") : "-"}
      </span>
    ),
  },
  {
    header: "Reference",
    accessorKey: "referenceCode",
    cell: (entry) => (
      <div>
        <span className="font-medium">{entry.referenceCode || "-"}</span>
        {entry.referenceType && (
          <span className="text-muted-foreground text-sm ml-2">
            ({entry.referenceType})
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Movement Type",
    accessorKey: "movementType",
    cell: (entry) => <MovementTypeBadge type={entry.movementType} />,
  },
  {
    header: "Item",
    cell: (entry) => (
      <div>
        <span className="font-medium">{entry.item?.name || "Unknown"}</span>
        <span className="text-muted-foreground text-sm ml-2">
          {entry.item?.code}
        </span>
      </div>
    ),
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    cell: (entry) => {
      const isOutflow = [
        StockMovementType.PICK,
        StockMovementType.SHIP,
        StockMovementType.DAMAGE,
        StockMovementType.EXPIRE,
      ].includes(entry.movementType);
      
      return (
        <span className={`font-medium ${isOutflow ? "text-red-600" : "text-green-600"}`}>
          {isOutflow ? "-" : "+"}{Math.abs(entry.quantity)} {entry.uom?.code || ""}
        </span>
      );
    },
  },
  {
    header: "UOM",
    cell: (entry) => <span>{entry.uom?.name || "-"}</span>,
  },
  {
    header: "Warehouse",
    cell: (entry) => (
      <div>
        <span className="font-medium">{entry.warehouse?.name || "Unknown"}</span>
        {entry.location?.name && (
          <span className="text-muted-foreground text-sm ml-2">
            / {entry.location.name}
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Balance",
    cell: () => (
      <span className="font-medium">
        -
      </span>
    ),
  },
  {
    header: "Remarks",
    accessorKey: "memo",
    cell: (entry) => (
      <span className="text-muted-foreground">
        {entry.memo || "-"}
      </span>
    ),
  },
];
