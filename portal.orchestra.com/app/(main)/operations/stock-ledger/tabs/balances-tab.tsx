"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, Package } from "lucide-react";
import { BalanceSummary } from "@/components/operations/stock-ledger/BalanceSummary";
import { useStockLedger } from "@/hooks/operations/useStockLedger";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { HasPermission } from "@/components/auth/HasPermission";

export function BalancesTab() {
  const [groupBy, setGroupBy] = useState<"item" | "warehouse" | "location">("item");
  const [search, setSearch] = useState("");
  
  const {
    stockBalances,
    warehouses,
    selectedWarehouse,
    setSelectedWarehouse,
    refetchLedger,
  } = useStockLedger();

  // Filter balances based on search
  const filteredBalances = stockBalances.filter(balance => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      balance.itemName.toLowerCase().includes(searchLower) ||
      balance.warehouseName.toLowerCase().includes(searchLower) ||
      (balance.locationName && balance.locationName.toLowerCase().includes(searchLower))
    );
  });

  // Group balances
  const groupedBalances = filteredBalances.reduce((acc, balance) => {
    let key: string;
    switch (groupBy) {
      case "item":
        key = `${balance.itemId}-${balance.itemName}`;
        break;
      case "warehouse":
        key = `${balance.warehouseId}-${balance.warehouseName}`;
        break;
      case "location":
        key = `${balance.locationId || 'none'}-${balance.locationName || 'No Location'}`;
        break;
    }
    
    if (!acc[key]) {
      acc[key] = {
        key,
        name: key.split('-')[1],
        totalQuantity: 0,
        items: [],
      };
    }
    
    acc[key].totalQuantity += balance.quantity;
    acc[key].items.push(balance);
    
    return acc;
  }, {} as Record<string, { key: string; name: string; totalQuantity: number; items: typeof stockBalances }>);

  return (
    <PermissionGuard permission="operations.stock.view">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Stock Balances</h2>
          </div>
          <HasPermission permission="operations.stock.manage">
            <Button variant="outline" onClick={() => refetchLedger()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </HasPermission>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items, warehouses, locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Warehouses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.code} - {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={groupBy} onValueChange={(value: "item" | "warehouse" | "location") => setGroupBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item">Group by Item</SelectItem>
                  <SelectItem value="warehouse">Group by Warehouse</SelectItem>
                  <SelectItem value="location">Group by Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.values(groupedBalances).map((group) => (
            <Card key={group.key}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <div className="text-2xl font-bold">
                  {group.totalQuantity.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {groupBy === "item" && `${group.items.length} location(s)`}
                    {groupBy === "warehouse" && `${group.items.length} item(s)`}
                    {groupBy === "location" && `${group.items.length} item(s)`}
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {group.items.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="text-xs flex justify-between">
                        <span>
                          {groupBy === "item" && `${item.warehouseName} ${item.locationName ? `> ${item.locationName}` : ''}`}
                          {groupBy === "warehouse" && `${item.itemName}`}
                          {groupBy === "location" && `${item.itemName}`}
                        </span>
                        <span className="font-mono">{item.quantity.toFixed(2)}</span>
                      </div>
                    ))}
                    {group.items.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        ... and {group.items.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed View */}
        <BalanceSummary balances={filteredBalances} />
      </div>
    </PermissionGuard>
  );
}
