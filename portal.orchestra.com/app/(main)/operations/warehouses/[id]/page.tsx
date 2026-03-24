"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGetWarehouseQuery } from "@/store/api";
import { WarehouseBreadcrumb } from "@/components/operations/warehouses/WarehouseBreadcrumb";
import { WarehouseTabs } from "@/components/operations/warehouses/WarehouseTabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function WarehouseDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const warehouseId = params.id as string;
  const tab = searchParams.get("tab") || "overview";

  const {
    data: warehouse,
    isLoading,
    error,
  } = useGetWarehouseQuery(warehouseId);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load warehouse details");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="space-y-6">
        <WarehouseBreadcrumb warehouseName="Not Found" />
        <Card>
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="space-y-1">
              <span className="text-muted-foreground">
                Warehouse not found or failed to load.
              </span>
              {error && (
                <p className="text-sm text-destructive">
                  Error: {JSON.stringify(error)}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Warehouse ID: {warehouseId}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WarehouseBreadcrumb warehouseName={warehouse.name} />
      <WarehouseTabs warehouse={warehouse} initialTab={tab} />
    </div>
  );
}
