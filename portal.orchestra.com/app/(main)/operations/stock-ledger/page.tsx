"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovementsTab, BalancesTab } from "./tabs";
import { Package, Activity } from "lucide-react";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export default function StockLedgerPage() {
  return (
    <PermissionGuard permission="operations.stock.view">
      <div className="container mx-auto py-6">
        <Tabs defaultValue="movements" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="movements" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Movements
              </TabsTrigger>
              <TabsTrigger value="balances" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Balances
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="movements">
            <MovementsTab />
          </TabsContent>

          <TabsContent value="balances">
            <BalancesTab />
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
}
