"use client";

import { useGetLocationsQuery } from "@/store/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Building, TrendingUp } from "lucide-react";

interface WarehouseStatsCardsProps {
  warehouseId: string;
}

export function WarehouseStatsCards({ warehouseId }: WarehouseStatsCardsProps) {
  const { data: locations = [], isLoading } = useGetLocationsQuery({
    warehouseId,
  });

  const totalLocations = locations.length;
  const activeLocations = locations.filter(l => l.isActive).length;
  const rootLocations = locations.filter(l => !l.parentId).length;
  const utilizationRate = totalLocations > 0 
    ? Math.round((activeLocations / totalLocations) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Locations",
      value: totalLocations,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Locations",
      value: activeLocations,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Root Locations",
      value: rootLocations,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.title === "Utilization Rate" && "Active / Total locations"}
              {stat.title === "Root Locations" && "Top-level locations"}
              {stat.title === "Total Locations" && "All locations in warehouse"}
              {stat.title === "Active Locations" && "Currently active"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
