"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Package, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/entity-manager";
import {
  useGetStockLedgerQuery,
  useRecordStockMovementMutation,
  useGetItemsQuery,
  useGetWarehousesQuery,
  useGetLocationsQuery,
  useGetItemUomsQuery,
} from "@/store/api";
import {
  CreateStockMovementRequest,
  StockLedgerQueryParams,
  StockMovementType,
} from "@/types";

export function useStockLedger() {
  const [search, setSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedMovementType, setSelectedMovementType] = useState<StockMovementType | undefined>();
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  // Query params for stock ledger
  const queryParams: StockLedgerQueryParams = useMemo(() => ({
    warehouseId: selectedWarehouse && selectedWarehouse !== "all" ? selectedWarehouse : undefined,
    movementType: selectedMovementType,
    referenceCode: search || undefined,
    startDate: dateRange.start,
    endDate: dateRange.end,
    limit: 100,
  }), [selectedWarehouse, selectedMovementType, search, dateRange]);

  // Data fetching
  const {
    data: ledgerEntries = [],
    isLoading: isLoadingLedger,
    error: ledgerError,
    refetch: refetchLedger,
  } = useGetStockLedgerQuery(queryParams);

  const { data: items = [] } = useGetItemsQuery({ isActive: true, limit: 1000 });
  const { data: warehouses = [] } = useGetWarehousesQuery({ limit: 1000 });
  // Only fetch locations when a warehouse is selected
  const { data: locations = [] } = useGetLocationsQuery(
    { warehouseId: selectedWarehouse && selectedWarehouse !== "all" ? selectedWarehouse : '', limit: 1000 },
    { skip: !selectedWarehouse || selectedWarehouse === "all" }
  );
  const { data: uoms = [] } = useGetItemUomsQuery();

  // Mutation
  const [recordMovement] = useRecordStockMovementMutation();

  // Handlers
  const handleCreateMovement = async (formData: CreateStockMovementRequest) => {
    try {
      await recordMovement(formData).unwrap();
      toast.success("Stock movement recorded successfully");
      refetchLedger();
      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to record movement");
      return false;
    }
  };

  // Calculate stock balances
  const stockBalances = useMemo(() => {
    const balances: Record<string, {
      itemId: string;
      itemName: string;
      warehouseId: string;
      warehouseName: string;
      locationId?: string;
      locationName?: string;
      uomId: string;
      uomName: string;
      quantity: number;
    }> = {};

    ledgerEntries.forEach(entry => {
      const key = `${entry.itemId}-${entry.warehouseId}-${entry.locationId || 'none'}`;
      
      if (!balances[key]) {
        const item = items.find(i => i.id.toString() === entry.itemId);
        const warehouse = warehouses.find(w => w.id === entry.warehouseId);
        const location = locations.find(l => l.id === entry.locationId);
        const uom = uoms.find(u => u.id.toString() === entry.uomId);

        balances[key] = {
          itemId: entry.itemId,
          itemName: item?.name || 'Unknown',
          warehouseId: entry.warehouseId,
          warehouseName: warehouse?.name || 'Unknown',
          locationId: entry.locationId,
          locationName: location?.name,
          uomId: entry.uomId,
          uomName: uom?.name || 'Unknown',
          quantity: 0,
        };
      }

      // Add or subtract based on movement type
      switch (entry.movementType) {
        case StockMovementType.RECEIPT:
          balances[key].quantity += Math.abs(entry.quantity);
          break;
        case StockMovementType.TRANSFER:
          // Transfer is handled by source/destination
          break;
        case StockMovementType.ADJUSTMENT:
          balances[key].quantity += entry.quantity;
          break;
        case StockMovementType.PICK:
        case StockMovementType.SHIP:
        case StockMovementType.DAMAGE:
        case StockMovementType.EXPIRE:
          balances[key].quantity -= Math.abs(entry.quantity);
          break;
        case StockMovementType.PACK:
        case StockMovementType.RETURN:
          balances[key].quantity += Math.abs(entry.quantity);
          break;
      }
    });

    return Object.values(balances).filter(b => b.quantity !== 0);
  }, [ledgerEntries, items, warehouses, locations, uoms]);

  const data = useMemo(() => ledgerEntries || [], [ledgerEntries]);
  
  // Calculate statistics
  const todayMovements = data.filter(entry => {
    const entryDate = new Date(entry.documentDate || "").toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  }).length;
  
  const pendingTransfers = data.filter(
    entry => entry.movementType === StockMovementType.TRANSFER
  ).length;
  
  const totalItems = stockBalances.length;
  
  const lowStockItems = stockBalances.filter(balance => balance.quantity < 10).length;
  
  const stats: StatCard[] = useMemo(
    () => [
      {
        label: "Today's Movements",
        value: todayMovements,
        icon: Activity,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Pending Transfers",
        value: pendingTransfers,
        icon: Package,
        color: "bg-blue-100 text-blue-700",
      },
      {
        label: "Total Items in Stock",
        value: totalItems,
        icon: TrendingUp,
        color: "bg-green-100 text-green-700",
      },
      {
        label: "Low Stock Items",
        value: lowStockItems,
        icon: AlertTriangle,
        color: "bg-orange-100 text-orange-700",
      },
    ],
    [todayMovements, pendingTransfers, totalItems, lowStockItems]
  );
  
  return {
    // Data
    data,
    ledgerEntries,
    stockBalances,
    items,
    warehouses,
    locations,
    uoms,
    
    // Stats
    stats,
    
    // Loading states
    isLoading: isLoadingLedger,
    error: ledgerError,
    
    // Filters
    search,
    setSearch,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedMovementType,
    setSelectedMovementType,
    dateRange,
    setDateRange,
    
    // Actions
    handleCreateMovement,
    handleUpdate: async () => {}, // Stock movements are immutable
    handleDelete: async () => {}, // Stock movements are immutable
    refetchLedger,
  };
}
