"use client";

import { Warehouse } from "@/types/operations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Package, Edit, Plus } from "lucide-react";
import { WarehouseStatsCards } from "../WarehouseStatsCards";
import { WarehouseCapacityCard } from "../WarehouseCapacityCard";
import { useGetWarehouseCapacityQuery } from "@/store/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface OverviewTabProps {
  warehouse: Warehouse;
}

export function OverviewTab({ warehouse }: OverviewTabProps) {
  const { data: capacity, isLoading: capacityLoading } = useGetWarehouseCapacityQuery(warehouse.id);

  return (
    <div className="space-y-6">
      {/* Warehouse Info Card */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Warehouse Information
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/operations/warehouses/${warehouse.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Warehouse
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/operations/warehouses/${warehouse.id}?tab=locations`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Warehouse Name</p>
              <p className="text-sm text-muted-foreground">{warehouse.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Warehouse Code</p>
              <p className="text-sm text-muted-foreground">{warehouse.code}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {warehouse.description || "No description provided"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Status</p>
              <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                {warehouse.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Default Warehouse</p>
              <Badge variant={warehouse.isDefault ? "default" : "outline"}>
                {warehouse.isDefault ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Created Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(warehouse.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <WarehouseStatsCards warehouseId={warehouse.id} />

      {/* Capacity Information */}
      {capacityLoading ? (
        <Card className="border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ) : capacity ? (
        <WarehouseCapacityCard 
          capacity={capacity} 
          warehouseName={warehouse.name}
        />
      ) : null}

      {/* Quick Actions */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href={`/operations/warehouses/${warehouse.id}?tab=locations`}>
                <MapPin className="h-6 w-6 mb-2" />
                Manage Locations
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href={`/operations/warehouses/${warehouse.id}?tab=inventory`}>
                <Package className="h-6 w-6 mb-2" />
                View Inventory
              </Link>
            </Button>
             
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
