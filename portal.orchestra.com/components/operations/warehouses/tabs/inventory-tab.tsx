"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle } from "lucide-react";

interface InventoryTabProps {
  warehouseId: string;
}

export function InventoryTab({ }: InventoryTabProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Management
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 p-6">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <span className="text-muted-foreground">
          Inventory management features will be implemented in a future update.
          This will include stock levels, item tracking, and inventory movements.
        </span>
      </CardContent>
    </Card>
  );
}
