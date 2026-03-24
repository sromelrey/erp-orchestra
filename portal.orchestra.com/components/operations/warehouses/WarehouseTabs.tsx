"use client";

import { useState } from "react";
import { Warehouse } from "@/types/operations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab, LocationsTab, InventoryTab, ActivityTab } from "./tabs";

interface WarehouseTabsProps {
  warehouse: Warehouse;
  initialTab?: string;
}

export function WarehouseTabs({ warehouse, initialTab = "overview" }: WarehouseTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="locations">Locations</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="activity">Activity Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewTab warehouse={warehouse} />
      </TabsContent>

      <TabsContent value="locations" className="space-y-6">
        <LocationsTab warehouseId={warehouse.id} />
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6">
        <InventoryTab warehouseId={warehouse.id} />
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <ActivityTab warehouseId={warehouse.id} />
      </TabsContent>
    </Tabs>
  );
}
